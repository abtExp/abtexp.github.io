
import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Point to the local file
        file_url = f"file://{os.path.abspath('docs/index.html')}"
        await page.goto(file_url)

        # Mobile View (iPhone 12/13/14 approx)
        await page.set_viewport_size({"width": 390, "height": 844})
        await page.wait_for_timeout(1000) # Wait for animations
        await page.screenshot(path="verification/layout_mobile_fixed.png", full_page=True)
        print("Mobile fixed screenshot taken.")

        # Tablet View (iPad Mini approx)
        await page.set_viewport_size({"width": 768, "height": 1024})
        await page.wait_for_timeout(1000)
        await page.screenshot(path="verification/layout_tablet_fixed.png", full_page=True)
        print("Tablet fixed screenshot taken.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
