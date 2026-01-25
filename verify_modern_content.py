import os
import time
from playwright.sync_api import sync_playwright

def verify_modern_content():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1. Desktop View
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Load local file
        file_path = os.path.abspath("docs/index.html")
        page.goto(f"file://{file_path}")

        # Wait for initial animations (increased)
        page.wait_for_timeout(4000)

        # Check Hero
        page.screenshot(path="verification/modern_desktop_hero.png")
        print("Desktop Hero screenshot taken.")

        # Scroll and check sections
        sections = ['about', 'experience', 'portfolio', 'skills', 'contact']
        for section in sections:
            page.locator(f'#{section}').scroll_into_view_if_needed()
            page.wait_for_timeout(1500)
            page.screenshot(path=f"verification/modern_desktop_{section}.png")
            print(f"Desktop {section} screenshot taken.")

        page.close()

        # 2. Mobile View
        page = browser.new_page(viewport={"width": 375, "height": 667})
        page.goto(f"file://{file_path}")
        page.wait_for_timeout(4000)

        # Check Mobile Hero
        page.screenshot(path="verification/modern_mobile_hero.png")
        print("Mobile Hero screenshot taken.")

        # Debug Menu Button
        btn = page.locator('#menu-btn')
        print(f"Menu Button Visible: {btn.is_visible()}")
        print(f"Menu Button Bounding Box: {btn.bounding_box()}")

        # Force click using js if needed or standard click
        try:
            page.click('#menu-btn', timeout=5000)
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/modern_mobile_menu.png")
            print("Mobile Menu screenshot taken.")

            # Click a link to close and scroll
            page.click('a[href="#about"].mobile-link')
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/modern_mobile_navigated.png")
            print("Mobile navigation verified.")
        except Exception as e:
            print(f"Failed to click menu: {e}")

        browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    verify_modern_content()
