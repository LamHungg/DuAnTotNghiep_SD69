/**
 * Test Script cho Form Thêm Sản Phẩm - Tối ưu theo nhóm màu
 * Chạy script này trong Console của trình duyệt khi đang ở trang /products/add
 */

console.log("🧪 Test Script cho Form Thêm Sản Phẩm (OPTIMIZED)");

const testAddProductForm = () => {
  console.log("=== TESTING ADD PRODUCT FORM ===");

  // Test 1: Kiểm tra header
  console.log("1. Testing header...");

  const header = document.querySelector(".header");
  const title = header?.querySelector("h1");
  const subtitle = header?.querySelector("p");

  console.log(`Header found: ${header ? "Yes" : "No"}`);
  console.log(`Title: ${title?.textContent}`);
  console.log(`Subtitle: ${subtitle?.textContent}`);

  // Test 2: Kiểm tra sections
  console.log("\n2. Testing sections...");

  const sections = document.querySelectorAll(".section");
  console.log(`Found ${sections.length} sections`);

  sections.forEach((section, index) => {
    const sectionTitle = section.querySelector("h3");
    console.log(`Section ${index + 1}: ${sectionTitle?.textContent}`);
  });

  // Test 3: Kiểm tra form elements
  console.log("\n3. Testing form elements...");

  const formGroups = document.querySelectorAll(".form-group");
  console.log(`Found ${formGroups.length} form groups`);

  const inputs = document.querySelectorAll("input, textarea, select");
  console.log(`Found ${inputs.length} input elements`);

  const selects = document.querySelectorAll(".react-select__control");
  console.log(`Found ${selects.length} react-select components`);

  // Test 4: Kiểm tra validation
  console.log("\n4. Testing validation...");

  const errorFields = document.querySelectorAll(".error");
  console.log(`Found ${errorFields.length} fields with errors`);

  const errorTexts = document.querySelectorAll(".error-text");
  console.log(`Found ${errorTexts.length} error messages`);

  // Test 5: Kiểm tra variants preview
  console.log("\n5. Testing variants preview...");

  const variantsPreview = document.querySelector(".variants-preview");
  if (variantsPreview) {
    const variantItems = variantsPreview.querySelectorAll(".variant-preview");
    console.log(`Found ${variantItems.length} variant preview items`);

    variantItems.forEach((item, index) => {
      console.log(`Variant ${index + 1}: ${item.textContent}`);
    });
  }

  // Test 6: Kiểm tra color groups
  console.log("\n6. Testing color groups...");

  const colorGroups = document.querySelectorAll(".color-group");
  console.log(`Found ${colorGroups.length} color groups`);

  colorGroups.forEach((group, index) => {
    const colorHeader = group.querySelector(".color-group-header");
    const colorName = colorHeader?.querySelector("h4")?.textContent;
    const variantCount =
      colorHeader?.querySelector(".variant-count")?.textContent;
    const totalQuantity = colorHeader?.querySelector(
      ".color-summary span:first-child"
    )?.textContent;

    console.log(
      `Color group ${
        index + 1
      }: ${colorName} - ${variantCount} - ${totalQuantity}`
    );

    const variants = group.querySelectorAll("tbody tr");
    console.log(`  Variants in this color: ${variants.length}`);
  });

  // Test 7: Kiểm tra buttons
  console.log("\n7. Testing buttons...");

  const buttons = document.querySelectorAll("button");

  console.log(`Found ${buttons.length} buttons`);

  const primaryButtons = document.querySelectorAll(".btn-primary");
  const secondaryButtons = document.querySelectorAll(".btn-secondary");
  const successButtons = document.querySelectorAll(".btn-success");
  const uploadButtons = document.querySelectorAll(".btn-upload");

  console.log(`Primary buttons: ${primaryButtons.length}`);
  console.log(`Secondary buttons: ${secondaryButtons.length}`);
  console.log(`Success buttons: ${successButtons.length}`);
  console.log(`Upload buttons: ${uploadButtons.length}`);

  // Test 8: Kiểm tra modal
  console.log("\n8. Testing modal...");

  const modal = document.querySelector(".modal-overlay");
  if (modal) {
    console.log("Modal is visible");

    const uploadArea = modal.querySelector(".upload-area");
    const currentImages = modal.querySelector(".current-images");

    console.log(`Upload area: ${uploadArea ? "Found" : "Not found"}`);
    console.log(`Current images: ${currentImages ? "Found" : "Not found"}`);
  } else {
    console.log("Modal is not visible");
  }

  // Test 9: Kiểm tra responsive design
  console.log("\n9. Testing responsive design...");

  const isMobile = window.innerWidth <= 768;
  console.log(`Screen width: ${window.innerWidth}px`);
  console.log(`Is mobile: ${isMobile}`);

  const formGrid = document.querySelector(".form-grid");
  if (formGrid) {
    const gridStyle = window.getComputedStyle(formGrid);
    console.log(`Form grid display: ${gridStyle.display}`);
    console.log(`Form grid columns: ${gridStyle.gridTemplateColumns}`);
  }

  // Test 10: Kiểm tra accessibility
  console.log("\n10. Testing accessibility...");

  const labels = document.querySelectorAll("label");

  console.log(`Found ${labels.length} labels`);

  const ariaLabels = document.querySelectorAll("[aria-label]");

  console.log(`Found ${ariaLabels.length} elements with aria-label`);

  const focusableElements = document.querySelectorAll(
    "input, select, textarea, button, [tabindex]"
  );
  console.log(`Found ${focusableElements.length} focusable elements`);

  console.log("\n=== FORM TEST COMPLETED ===");
};

const testFormValidation = () => {
  console.log("=== TESTING FORM VALIDATION ===");

  // Test basic validation
  console.log("1. Testing basic validation...");

  const productNameInput = document.querySelector(
    'input[placeholder*="tên sản phẩm"]'
  );
  const categorySelect = document.querySelector(".react-select__control");

  if (productNameInput) {
    console.log("Product name input found");
    // Test empty validation
    productNameInput.value = "";
    productNameInput.dispatchEvent(new Event("change"));

    setTimeout(() => {
      const error = document.querySelector(".error-text");
      console.log(`Empty product name error: ${error ? "Found" : "Not found"}`);
    }, 100);
  }

  // Test size and color validation
  console.log("\n2. Testing size and color validation...");

  const sizeSelect = document.querySelector('select[placeholder*="kích cỡ"]');
  const colorSelect = document.querySelector('select[placeholder*="màu sắc"]');

  console.log(`Size select: ${sizeSelect ? "Found" : "Not found"}`);
  console.log(`Color select: ${colorSelect ? "Found" : "Not found"}`);

  // Test price validation
  console.log("\n3. Testing price validation...");

  const priceInputs = document.querySelectorAll('input[type="number"]');
  console.log(`Found ${priceInputs.length} price inputs`);

  priceInputs.forEach((input, index) => {
    console.log(`Price input ${index + 1}: ${input.placeholder || input.name}`);
  });

  console.log("\n=== FORM VALIDATION TEST COMPLETED ===");
};

const testVariantsGeneration = () => {
  console.log("=== TESTING VARIANTS GENERATION ===");

  // Check variants container
  console.log("1. Checking variants container...");

  const variantsContainer = document.querySelector(
    ".variants-preview, .color-groups"
  );

  if (variantsContainer) {
    console.log("Variants container found");

    const variantItems = variantsContainer.querySelectorAll(
      ".variant-preview, tbody tr"
    );
    console.log(`Current variants: ${variantItems.length}`);

    // Calculate expected variants
    const sizeOptions = document.querySelectorAll(".react-select__option");
    const colorOptions = document.querySelectorAll(".react-select__option");

    console.log(`Size options: ${sizeOptions.length}`);
    console.log(`Color options: ${colorOptions.length}`);

    const expectedVariants = sizeOptions.length * colorOptions.length;
    console.log(`Expected variants: ${expectedVariants}`);
  } else {
    console.log("No variants container found");
  }

  console.log("\n=== VARIANTS GENERATION TEST COMPLETED ===");
};

const testColorGrouping = () => {
  console.log("=== TESTING COLOR GROUPING ===");

  const colorGroups = document.querySelectorAll(".color-group");
  console.log(`Found ${colorGroups.length} color groups`);

  colorGroups.forEach((group, index) => {
    const colorName = group.querySelector(".color-info h4")?.textContent;
    const variantCount = group.querySelector(".variant-count")?.textContent;
    const totalQuantity = group.querySelector(
      ".color-summary span:first-child"
    )?.textContent;
    const totalImages = group.querySelector(
      ".color-summary span:last-child"
    )?.textContent;

    console.log(`Color group ${index + 1}:`);
    console.log(`  Color: ${colorName}`);
    console.log(`  Variants: ${variantCount}`);
    console.log(`  Total quantity: ${totalQuantity}`);
    console.log(`  Total images: ${totalImages}`);

    const variants = group.querySelectorAll("tbody tr");
    console.log(`  Individual variants: ${variants.length}`);

    variants.forEach((variant, vIndex) => {
      const size = variant.querySelector(".size-label")?.textContent;
      const quantity = variant.querySelector('input[type="number"]')?.value;
      const price = variant.querySelectorAll('input[type="number"]')[1]?.value;

      console.log(
        `    Variant ${
          vIndex + 1
        }: ${size} - Qty: ${quantity} - Price: ${price}`
      );
    });
  });

  console.log("\n=== COLOR GROUPING TEST COMPLETED ===");
};

const testImageUpload = () => {
  console.log("=== TESTING IMAGE UPLOAD ===");

  const uploadButtons = document.querySelectorAll(".btn-upload");
  console.log(`Found ${uploadButtons.length} upload buttons`);

  uploadButtons.forEach((button, index) => {
    const buttonText = button.textContent.trim();
    const isSmall = button.classList.contains("small");
    console.log(
      `Upload button ${index + 1}: "${buttonText}" (small: ${isSmall})`
    );

    // Test click event
    button.addEventListener("click", () => {
      console.log(`Upload button ${index + 1} clicked`);
    });
  });

  // Check for file input
  const fileInputs = document.querySelectorAll('input[type="file"]');
  console.log(`Found ${fileInputs.length} file inputs`);

  fileInputs.forEach((input, index) => {
    console.log(`File input ${index + 1}: accept="${input.accept}"`);
  });

  console.log("\n=== IMAGE UPLOAD TEST COMPLETED ===");
};

const testFormSubmission = () => {
  console.log("=== TESTING FORM SUBMISSION ===");

  const saveButton = document.querySelector(".btn-success");
  const cancelButton = document.querySelector(".btn-secondary");

  console.log(`Save button: ${saveButton ? "Found" : "Not found"}`);
  console.log(`Cancel button: ${cancelButton ? "Found" : "Not found"}`);

  if (saveButton) {
    console.log(`Save button text: ${saveButton.textContent}`);
    console.log(`Save button disabled: ${saveButton.disabled}`);
  }

  if (cancelButton) {
    console.log(`Cancel button text: ${cancelButton.textContent}`);
  }

  console.log("\n=== FORM SUBMISSION TEST COMPLETED ===");
};

const testColorGroupFunctionality = () => {
  console.log("=== TESTING COLOR GROUP FUNCTIONALITY ===");

  const colorGroups = document.querySelectorAll(".color-group");
  console.log(`Testing ${colorGroups.length} color groups`);

  colorGroups.forEach((group, index) => {
    const colorUploadBtn = group.querySelector(".btn-upload:not(.small)");
    const individualUploadBtns = group.querySelectorAll(".btn-upload.small");

    console.log(`Color group ${index + 1}:`);
    console.log(
      `  Color upload button: ${colorUploadBtn ? "Found" : "Not found"}`
    );
    console.log(`  Individual upload buttons: ${individualUploadBtns.length}`);

    // Test color group upload
    if (colorUploadBtn) {
      colorUploadBtn.addEventListener("click", () => {
        console.log(`Color group ${index + 1} upload clicked`);
      });
    }

    // Test individual uploads
    individualUploadBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", () => {
        console.log(
          `Individual upload ${btnIndex + 1} in color group ${
            index + 1
          } clicked`
        );
      });
    });
  });

  console.log("\n=== COLOR GROUP FUNCTIONALITY TEST COMPLETED ===");
};

const testImageUploadAPI = async () => {
  console.log("=== TESTING IMAGE UPLOAD API ===");

  try {
    // Test single file upload
    console.log("1. Testing single file upload...");

    // Tạo một file test đơn giản
    const testFile = new File(["test image content"], "test-image.jpg", {
      type: "image/jpeg",
    });

    console.log(
      "Test file created:",
      testFile.name,
      testFile.size,
      testFile.type
    );

    // Import service function
    const { uploadImageToServer } = await import(
      "./src/services/sanPhamService.js"
    );

    // Test upload
    const result = await uploadImageToServer(testFile);
    console.log("Upload result:", result);
  } catch (error) {
    console.error("Upload API test failed:", error);
  }

  console.log("\n=== IMAGE UPLOAD API TEST COMPLETED ===");
};

// Run all tests
const runAllTests = () => {
  console.log(
    "🚀 Starting comprehensive test of Add Product form (Optimized)..."
  );

  testAddProductForm();
  testFormValidation();
  testVariantsGeneration();
  testColorGrouping();
  testImageUpload();
  testFormSubmission();
  testColorGroupFunctionality();

  // Test API upload
  testImageUploadAPI();

  console.log("\n🎉 All tests completed!");
  console.log("📋 Check the console for detailed results");
  console.log("💡 Key improvements:");
  console.log("   ✅ Layout 2 cột: thông tin bên trái, biến thể bên phải");
  console.log("   ✅ Nhóm biến thể theo màu sắc");
  console.log("   ✅ Upload ảnh theo màu hoặc từng biến thể");
  console.log("   ✅ Responsive design cho mobile/tablet");
  console.log("   ✅ Validation và error handling");
  console.log("   ✅ Preview biến thể real-time");
};

// Auto-run if on the correct page
if (window.location.pathname.includes("products/add")) {
  console.log("📍 Detected Add Product page - running tests...");
  setTimeout(runAllTests, 1000); // Wait for page to load
} else {
  console.log("❌ Not on Add Product page");
  console.log("💡 Run 'runAllTests()' manually when on the correct page");
}
