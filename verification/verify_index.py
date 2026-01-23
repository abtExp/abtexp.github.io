import os
from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop Test
        print("Running Desktop Test...")
        page = browser.new_page()
        file_path = os.path.abspath('docs/index.html')
        page.goto(f'file://{file_path}')
        page.screenshot(path='verification/homepage.png')

        nav = page.locator('#navigation')
        if nav.is_visible():
            nav.screenshot(path='verification/navigation.png')
            print("Desktop navigation captured.")

        # Mobile Test
        print("Running Mobile Test...")
        context = browser.new_context(viewport={'width': 375, 'height': 667})
        mobile_page = context.new_page()
        mobile_page.goto(f'file://{file_path}')
        mobile_page.screenshot(path='verification/mobile_homepage.png')

        hamburger = mobile_page.locator('#hamburger-menu')
        if hamburger.is_visible():
            hamburger.screenshot(path='verification/hamburger.png')
            print("Hamburger menu captured.")
        else:
            print("Hamburger menu NOT visible in mobile view.")

        browser.close()

if __name__ == "__main__":
    verify_homepage()
