import os
from playwright.sync_api import sync_playwright

def verify_portfolio():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Load local file
        file_path = os.path.abspath("docs/index.html")
        page.goto(f"file://{file_path}")

        # Wait for animations
        page.wait_for_timeout(2000)

        # 1. Screenshot Hero (Colorful)
        page.screenshot(path="verification/1_hero_colorful.png")
        print("Hero screenshot taken.")

        # 2. Open Menu
        page.click('.menu-btn')
        page.wait_for_timeout(1000) # Wait for menu animation
        page.screenshot(path="verification/2_menu_overlay.png")
        print("Menu screenshot taken.")

        # Close Menu
        page.click('.close-btn')
        page.wait_for_timeout(1000)

        # 3. Scroll to Work
        page.evaluate("window.scrollTo(0, window.innerHeight * 2)")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/3_work_colorful.png")
        print("Work screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_portfolio()
