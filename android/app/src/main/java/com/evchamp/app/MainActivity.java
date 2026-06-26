package com.evchamp.app;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.getcapacitor.BridgeActivity;
import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Log;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "EVChamp";
    private static final int PERMISSION_REQUEST_CODE = 100;
    private static final int EXACT_ALARM_REQUEST_CODE = 101;
    private static final int SETTINGS_REQUEST_CODE = 102;

    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar topProgressBar;
    private LinearLayout offlineView;
    private WebView webView;
    private ConnectivityManager.NetworkCallback networkCallback;
    private boolean permissionsGranted = false;
    private boolean permissionsRequested = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d(TAG, "🚀 MainActivity onCreate - requesting permissions");
        
        // Request permissions on app launch
        if (!permissionsRequested) {
            permissionsRequested = true;
            requestAppPermissions();
        }

        webView = getBridge().getWebView();
        if (webView == null) return;

        // --- WebView Settings ---
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        // Remove ";wv" so Clerk does not block WebView user agent
        settings.setUserAgentString(settings.getUserAgentString().replace("; wv", ""));

        // Allow cookies (required for Clerk session)
        android.webkit.CookieManager.getInstance().setAcceptCookie(true);
        android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        // --- WebViewClient: handle navigation + loading states ---
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                // Keep clerk, evchamp, zeflash URLs inside the app
                if (url.contains("clerk") || url.contains("evchamp") || url.contains("zeflash")) {
                    view.loadUrl(url);
                    return true;
                }
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (topProgressBar != null) {
                    topProgressBar.setVisibility(View.VISIBLE);
                    topProgressBar.setProgress(0);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (topProgressBar != null) {
                    topProgressBar.setProgress(100);
                    topProgressBar.setVisibility(View.GONE);
                }
                if (swipeRefreshLayout != null) {
                    swipeRefreshLayout.setRefreshing(false);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame() && !isNetworkAvailable()) {
                    runOnUiThread(() -> showOfflineView());
                }
            }
        });

        // --- WebChromeClient: track load progress ---
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                if (topProgressBar != null) {
                    topProgressBar.setProgress(newProgress);
                    topProgressBar.setVisibility(newProgress < 100 ? View.VISIBLE : View.GONE);
                }
            }
        });

        // --- Wrap WebView in SwipeRefreshLayout ---
        ViewGroup parent = (ViewGroup) webView.getParent();
        if (parent != null) {
            int index = parent.indexOfChild(webView);
            parent.removeView(webView);

            // Root frame
            FrameLayout rootFrame = new FrameLayout(this);
            rootFrame.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

            // SwipeRefreshLayout
            swipeRefreshLayout = new SwipeRefreshLayout(this);
            swipeRefreshLayout.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
            swipeRefreshLayout.setColorSchemeResources(android.R.color.holo_green_dark);
            swipeRefreshLayout.addView(webView);
            swipeRefreshLayout.setOnRefreshListener(() -> {
                if (isNetworkAvailable()) {
                    hideOfflineView();
                    webView.reload();
                } else {
                    swipeRefreshLayout.setRefreshing(false);
                    showOfflineView();
                }
            });

            // Top progress bar
            topProgressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
            FrameLayout.LayoutParams pbParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 8);
            pbParams.gravity = Gravity.TOP;
            topProgressBar.setLayoutParams(pbParams);
            topProgressBar.setMax(100);
            topProgressBar.setProgressTintList(
                android.content.res.ColorStateList.valueOf(Color.parseColor("#22C55E")));
            topProgressBar.setVisibility(View.GONE);

            // Offline view
            offlineView = buildOfflineView();
            offlineView.setVisibility(View.GONE);

            rootFrame.addView(swipeRefreshLayout);
            rootFrame.addView(topProgressBar);
            rootFrame.addView(offlineView);

            parent.addView(rootFrame, index);
        }

        // --- Network monitoring ---
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                runOnUiThread(() -> {
                    hideOfflineView();
                    if (webView != null) webView.reload();
                });
            }

            @Override
            public void onLost(Network network) {
                runOnUiThread(() -> showOfflineView());
            }
        };
        NetworkRequest request = new NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build();
        cm.registerNetworkCallback(request, networkCallback);

        // Show offline immediately if no network at start
        if (!isNetworkAvailable()) {
            showOfflineView();
        }
    }

    private LinearLayout buildOfflineView() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundColor(Color.WHITE);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT);
        layout.setLayoutParams(lp);
        layout.setPadding(64, 64, 64, 64);

        TextView emoji = new TextView(this);
        emoji.setText("📶");
        emoji.setTextSize(48f);
        emoji.setGravity(Gravity.CENTER);

        TextView title = new TextView(this);
        title.setText("No Internet Connection");
        title.setTextSize(20f);
        title.setTextColor(Color.parseColor("#111827"));
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 24, 0, 8);
        title.setTypeface(null, android.graphics.Typeface.BOLD);

        TextView subtitle = new TextView(this);
        subtitle.setText("Please check your connection and try again.");
        subtitle.setTextSize(14f);
        subtitle.setTextColor(Color.parseColor("#6B7280"));
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 0, 0, 40);

        Button retryBtn = new Button(this);
        retryBtn.setText("Retry");
        retryBtn.setTextColor(Color.WHITE);
        retryBtn.setBackgroundColor(Color.parseColor("#22C55E"));
        retryBtn.setPadding(80, 24, 80, 24);
        retryBtn.setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                hideOfflineView();
                if (webView != null) webView.reload();
            }
        });

        layout.addView(emoji);
        layout.addView(title);
        layout.addView(subtitle);
        layout.addView(retryBtn);

        return layout;
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        Network net = cm.getActiveNetwork();
        if (net == null) return false;
        NetworkCapabilities caps = cm.getNetworkCapabilities(net);
        return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void showOfflineView() {
        if (offlineView != null) offlineView.setVisibility(View.VISIBLE);
        if (topProgressBar != null) topProgressBar.setVisibility(View.GONE);
        if (swipeRefreshLayout != null) swipeRefreshLayout.setRefreshing(false);
    }

    private void hideOfflineView() {
        if (offlineView != null) offlineView.setVisibility(View.GONE);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        new AlertDialog.Builder(this)
            .setTitle("Exit EVChamp")
            .setMessage("Do you want to exit the app?")
            .setPositiveButton("Exit", (dialog, which) -> finishAffinity())
            .setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss())
            .setCancelable(true)
            .show();
    }

    /**
     * Attempt to schedule notifications, requesting permissions if needed
     */
    private void attemptScheduleNotifications() {
        Log.d(TAG, "📅 Attempting to schedule notifications...");
        
        // Just schedule without permission checks - Android will handle it
        // The app already has POST_NOTIFICATIONS and SCHEDULE_EXACT_ALARM in manifest
        try {
            NotificationScheduler.scheduleAll(this);
            Log.d(TAG, "✅ Notifications scheduled successfully");
        } catch (Exception e) {
            Log.e(TAG, "❌ Error scheduling notifications:", e);
            e.printStackTrace();
        }
    }

    /**
     * Request all required permissions for the app
     */
    private void requestAppPermissions() {
        Log.d(TAG, "🔐 Requesting app permissions...");
        
        java.util.List<String> requiredPermissions = new java.util.ArrayList<>();
        
        // Location permissions (for finding nearby chargers)
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requiredPermissions.add(Manifest.permission.ACCESS_FINE_LOCATION);
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requiredPermissions.add(Manifest.permission.ACCESS_COARSE_LOCATION);
        }
        
        // Camera permission (for EV marketplace, profile photos, etc.)
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requiredPermissions.add(Manifest.permission.CAMERA);
        }
        
        // Notification permission (for Android 13+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requiredPermissions.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        }
        
        // Exact alarm permission (for Android 12+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.SCHEDULE_EXACT_ALARM) != PackageManager.PERMISSION_GRANTED) {
                requiredPermissions.add(Manifest.permission.SCHEDULE_EXACT_ALARM);
            }
        }
        
        // Storage permission (for file uploads)
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            requiredPermissions.add(Manifest.permission.READ_EXTERNAL_STORAGE);
        }
        
        if (!requiredPermissions.isEmpty()) {
            showPermissionDialog(requiredPermissions.toArray(new String[0]));
        } else {
            Log.d(TAG, "✅ All permissions already granted");
            permissionsGranted = true;
            attemptScheduleNotifications();
        }
    }

    /**
     * Show beautiful permission request dialog
     */
    private void showPermissionDialog(String[] permissions) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setCancelable(false);
        
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(32, 32, 32, 32);
        
        // Title
        TextView title = new TextView(this);
        title.setText("App Permissions");
        title.setTextSize(22f);
        title.setTextColor(Color.parseColor("#111827"));
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        title.setPadding(0, 0, 0, 16);
        layout.addView(title);
        
        // Description
        TextView description = new TextView(this);
        description.setText("EVChamp needs the following permissions to provide you with the best experience:");
        description.setTextSize(14f);
        description.setTextColor(Color.parseColor("#6B7280"));
        description.setLineSpacing(1.5f, 1.5f);
        description.setPadding(0, 0, 0, 24);
        layout.addView(description);
        
        // Permission items
        LinearLayout permissionsContainer = new LinearLayout(this);
        permissionsContainer.setOrientation(LinearLayout.VERTICAL);
        permissionsContainer.setBackgroundColor(Color.parseColor("#F3F4F6"));
        permissionsContainer.setPadding(16, 16, 16, 16);
        
        for (String permission : permissions) {
            LinearLayout permissionItem = createPermissionItem(permission);
            permissionsContainer.addView(permissionItem);
        }
        
        layout.addView(permissionsContainer);
        
        builder.setView(layout);
        
        builder.setPositiveButton("Allow All", (dialog, which) -> {
            Log.d(TAG, "User allowed all permissions");
            ActivityCompat.requestPermissions(MainActivity.this, permissions, PERMISSION_REQUEST_CODE);
        });
        
        builder.setNegativeButton("Skip for Now", (dialog, which) -> {
            Log.d(TAG, "User skipped permissions - enabling notifications automatically");
            // Request notification permission automatically
            requestNotificationPermissionAutomatically();
        });
        
        AlertDialog dialog = builder.create();
        dialog.show();
        
        // Style buttons
        Button positiveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
        if (positiveButton != null) {
            positiveButton.setTextColor(Color.parseColor("#22C55E"));
            positiveButton.setTextSize(16f);
        }
        
        Button negativeButton = dialog.getButton(AlertDialog.BUTTON_NEGATIVE);
        if (negativeButton != null) {
            negativeButton.setTextColor(Color.parseColor("#6B7280"));
            negativeButton.setTextSize(16f);
        }
    }

    /**
     * Create a permission item UI
     */
    private LinearLayout createPermissionItem(String permission) {
        LinearLayout item = new LinearLayout(this);
        item.setOrientation(LinearLayout.HORIZONTAL);
        item.setPadding(0, 12, 0, 12);
        
        // Icon
        TextView icon = new TextView(this);
        icon.setTextSize(20f);
        icon.setPadding(0, 0, 16, 0);
        
        String description = "";
        switch (permission) {
            case Manifest.permission.ACCESS_FINE_LOCATION:
            case Manifest.permission.ACCESS_COARSE_LOCATION:
                icon.setText("L");
                description = "Location - Find nearby charging stations and services";
                break;
            case Manifest.permission.CAMERA:
                icon.setText("C");
                description = "Camera - Upload EV photos and take pictures";
                break;
            case Manifest.permission.POST_NOTIFICATIONS:
                icon.setText("N");
                description = "Notifications - Get charging reminders and updates";
                break;
            case Manifest.permission.SCHEDULE_EXACT_ALARM:
                icon.setText("A");
                description = "Alarms - Schedule precise notification timings";
                break;
            case Manifest.permission.READ_EXTERNAL_STORAGE:
                icon.setText("S");
                description = "Storage - Upload documents and photos";
                break;
            default:
                icon.setText("P");
                description = permission;
        }
        
        item.addView(icon);
        
        // Description text
        TextView text = new TextView(this);
        text.setText(description);
        text.setTextSize(13f);
        text.setTextColor(Color.parseColor("#374151"));
        text.setLineSpacing(1.4f, 1.4f);
        
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            1.0f
        );
        text.setLayoutParams(textParams);
        item.addView(text);
        
        return item;
    }

    /**
     * Schedule notifications only if permissions are granted
     */
    private void scheduleNotificationsIfPermitted() {
        Log.d(TAG, "📅 Scheduling notifications...");
        NotificationScheduler.scheduleAll(this);
        Log.d(TAG, "✅ Notifications scheduled successfully");
    }

    /**
     * Automatically request notification permission when user skips
     */
    private void requestNotificationPermissionAutomatically() {
        Log.d(TAG, "Requesting notification permission automatically...");
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.POST_NOTIFICATIONS},
                    PERMISSION_REQUEST_CODE
                );
                Log.d(TAG, "Requesting POST_NOTIFICATIONS permission");
                return;
            }
        }
        
        // If already granted or Android version doesn't need it, schedule notifications
        Log.d(TAG, "Notification permission already granted or not needed");
        attemptScheduleNotifications();
    }

    /**
     * Handle permission request results
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        Log.d(TAG, "Permission result for request code: " + requestCode);
        
        if (requestCode == PERMISSION_REQUEST_CODE || requestCode == EXACT_ALARM_REQUEST_CODE) {
            // Retry scheduling after permission request
            Log.d(TAG, "Retrying notification scheduling after permission request");
            attemptScheduleNotifications();
        }
    }

    /**
     * Handle return from settings screen and reschedule if permissions changed
     */
    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume - checking permissions and rescheduling if needed");
        attemptScheduleNotifications();
    }
}


