from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Point to the local file
        file_path = os.path.abspath('docs/index.html')
        file_url = f"file://{file_path}"
        print(f"Navigating to: {file_url}")
        page.goto(file_url)

        # 1. Desktop View (1920x1080)
        page.set_viewport_size({"width": 1920, "height": 1080})
        # Wait for initial animations (GSAP)
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/desktop_hero.png")
        print("Desktop hero screenshot taken.")

        # Scroll down to see other sections
        page.evaluate("window.scrollTo(0, 1000)")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/desktop_about.png")
        print("Desktop about screenshot taken.")

        # 2. Tablet View (768x1024)
        page.set_viewport_size({"width": 768, "height": 1024})
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/tablet_hero.png")
        print("Tablet hero screenshot taken.")

        # 3. Mobile View (375x812)
        page.set_viewport_size({"width": 375, "height": 812})
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)
        # Click menu to open it
        try:
            page.click(".nav-toggle")
            page.wait_for_timeout(500)
            page.screenshot(path="verification/mobile_menu.png")
            print("Mobile menu screenshot taken.")
        except Exception as e:
            print(f"Error clicking menu: {e}")

        browser.close()

if __name__ == "__main__":
    run()
