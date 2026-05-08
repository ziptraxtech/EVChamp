package com.evchamp.app;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private SwipeRefreshLayout swipeRefreshLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        if (webView != null) {
            // ── Essential settings for Clerk auth to work in WebView ──
            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setSupportMultipleWindows(true);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

            // Enable third-party cookies (needed by Clerk session tokens)
            CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            cookieManager.setAcceptThirdPartyCookies(webView, true);

            // Handle popup windows opened by Clerk (e.g. OAuth providers)
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public boolean onCreateWindow(WebView view, boolean isDialog,
                                              boolean isUserGesture, android.os.Message resultMsg) {
                    WebView popupView = new WebView(MainActivity.this);
                    WebSettings popupSettings = popupView.getSettings();
                    popupSettings.setJavaScriptEnabled(true);
                    popupSettings.setDomStorageEnabled(true);
                    popupSettings.setSupportMultipleWindows(true);
                    popupSettings.setJavaScriptCanOpenWindowsAutomatically(true);
                    popupSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                    CookieManager.getInstance().setAcceptThirdPartyCookies(popupView, true);

                    popupView.setWebViewClient(new WebViewClient() {
                        @Override
                        public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                            String url = req.getUrl().toString();
                            // When Clerk finishes auth and redirects back to our domain, load in main view
                            if (url.contains("evchamp.vercel.app") || url.contains("evchamp.in")) {
                                webView.loadUrl(url);
                                popupView.destroy();
                                return true;
                            }
                            return false;
                        }
                    });

                    WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                    transport.setWebView(popupView);
                    resultMsg.sendToTarget();
                    return true;
                }
            });

            // ── Pull-to-refresh wrapper ──
            ViewGroup parent = (ViewGroup) webView.getParent();
            if (parent != null) {
                int index = parent.indexOfChild(webView);
                parent.removeView(webView);

                swipeRefreshLayout = new SwipeRefreshLayout(this);
                swipeRefreshLayout.setLayoutParams(webView.getLayoutParams());
                swipeRefreshLayout.setColorSchemeResources(android.R.color.holo_green_dark);

                parent.addView(swipeRefreshLayout, index);
                swipeRefreshLayout.addView(webView);

                swipeRefreshLayout.setOnRefreshListener(() -> {
                    webView.reload();
                    swipeRefreshLayout.setRefreshing(false);
                });
            }
        }
    }

    @Override
    public void onBackPressed() {
        WebView webView = getBridge().getWebView();

        // If WebView has navigation history, go to home page top
        if (webView.canGoBack()) {
            webView.evaluateJavascript(
                "(function(){ window.location.href = '/'; setTimeout(function(){ window.scrollTo({top:0,behavior:'smooth'}); }, 100); })();",
                null
            );
            return;
        }

        // Already at root — show exit confirmation dialog
        new AlertDialog.Builder(this)
            .setTitle("Exit EVChamp")
            .setMessage("Do you want to exit?")
            .setPositiveButton("Exit", (dialog, which) -> {
                finishAffinity();
            })
            .setNegativeButton("No", (dialog, which) -> {
                dialog.dismiss();
            })
            .setCancelable(false)
            .show();
    }
}
