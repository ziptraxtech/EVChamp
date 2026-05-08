package com.evchamp.app;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private SwipeRefreshLayout swipeRefreshLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();
        if (webView != null) {

            // Critical settings for Clerk sign-in to work in WebView
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

            // Allow third-party cookies (required for Clerk session)
            android.webkit.CookieManager.getInstance().setAcceptCookie(true);
            android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

            // Keep Clerk/auth redirects inside the app, not in external browser
            webView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(android.webkit.WebView view, android.webkit.WebResourceRequest request) {
                    String url = request.getUrl().toString();
                    if (url.contains("clerk") || url.contains("evchamp") || url.contains("zeflash")) {
                        view.loadUrl(url);
                        return true;
                    }
                    return false;
                }
            });

            webView.setWebChromeClient(new WebChromeClient());

            // Wrap in SwipeRefreshLayout for pull-to-refresh
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

        if (webView.canGoBack()) {
            webView.evaluateJavascript(
                "(function(){ window.location.href = '/'; setTimeout(function(){ window.scrollTo({top:0,behavior:'smooth'}); }, 100); })();",
                null
            );
            return;
        }

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
