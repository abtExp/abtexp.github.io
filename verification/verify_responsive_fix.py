
from playwright.sync_api import sync_playwright
import os

def verify_timeline(page, width, filename):
    page.set_viewport_size({"width": width, "height": 800})
    file_url = f"file://{os.path.abspath('docs/index.html')}"
    page.goto(file_url)
    page.wait_for_timeout(1000) # Wait for animations

    # Scroll to experience section
    page.locator("#experience").scroll_into_view_if_needed()
    page.wait_for_timeout(500)

    page.screenshot(path=filename)
    print(f"Screenshot saved to {filename}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_timeline(page, 320, "verification/mobile_320_timeline.png")
            verify_timeline(page, 375, "verification/mobile_375_timeline.png")
        finally:
            browser.close()
