window.slideintro = [];

// Current editing slide index
let currentEditingSlideIndex = null;

// Current viewing slide index for slideshow
let currentSlideIndex = 0;

$(document).on('click', '#gameSlideBtn', function () {
    console.log('open/close intro');
    $('#gameSlideIntro').toggleClass('active');
    $('#gameSlideBtn').toggleClass('active');
    
    // Initialize slideshow when opening
    if ($('#gameSlideIntro').hasClass('active')) {
        initSlideshow();
    } else {
        // Stop any playing videos when closing
        stopCurrentVideo();
    }
});

// Initialize Slideshow
function initSlideshow() {
    if (window.slideintro.length === 0) {
        $('.slideshow-container').hide();
        $('.no-slides-message').show();
    } else {
        $('.slideshow-container').show();
        $('.no-slides-message').hide();
        currentSlideIndex = 0;
        displaySlide(currentSlideIndex);
    }
}

// Display Slide
function displaySlide(index) {
    if (window.slideintro.length === 0) return;
    
    const slide = window.slideintro[index];
    const mediaContainer = $('#currentSlideMedia');
    const textContainer = $('#currentSlideText');
    
    // Clear previous content
    mediaContainer.empty();
    textContainer.empty();
    
    // Display media
    if (slide.mediaUrl && slide.mediaType !== 'none') {
        if (slide.mediaType === 'image') {
            mediaContainer.html(`<img src="${slide.mediaUrl}" alt="Slide ${index + 1}">`);
        } else if (slide.mediaType === 'video') {
            mediaContainer.html(`<video src="${slide.mediaUrl}" controls autoplay></video>`);
        }
    }
    
    // Display text
    if (slide.text) {
        textContainer.html(slide.text.replace(/\n/g, '<br>'));
    }
    
    // Update indicator
    $('#currentSlideNumber').text(index + 1);
    $('#totalSlideNumber').text(window.slideintro.length);
    
    // Update button states
    $('#prevSlideBtn').prop('disabled', index === 0);
    $('#nextSlideBtn').prop('disabled', index === window.slideintro.length - 1);
    
    // Trigger animation
    $('.slide-content-wrapper').css('animation', 'none');
    setTimeout(() => {
        $('.slide-content-wrapper').css('animation', 'slideIn 0.5s ease-out');
    }, 10);
}

// Stop current video if playing
function stopCurrentVideo() {
    const video = $('#currentSlideMedia video')[0];
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

// Previous Slide
$(document).on('click', '#prevSlideBtn', function () {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        displaySlide(currentSlideIndex);
    }
});

// Next Slide
$(document).on('click', '#nextSlideBtn', function () {
    if (currentSlideIndex < window.slideintro.length - 1) {
        currentSlideIndex++;
        displaySlide(currentSlideIndex);
    }
});

// Keyboard navigation
$(document).on('keydown', function(e) {
    if ($('#gameSlideIntro').hasClass('active')) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            $('#prevSlideBtn').click();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            $('#nextSlideBtn').click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            $('#gameSlideBtn').click(); // Close the slideshow panel
        }
    }
});

// Open Slide Creator Modal
$(document).on('click', '#btnCreateSlide', function () {
    renderSlideList();
    $('#slideCreatorModal').fadeIn();
});

// Close Slide Creator Modal
$(document).on('click', '#closeSlideCreatorModal', function () {
    $('#slideCreatorModal').fadeOut();
});

// Close modal when clicking outside
$(document).on('click', '.slide-modal', function (e) {
    if (e.target === this) {
        $(this).fadeOut();
    }
});

// Add New Slide
$(document).on('click', '#addNewSlideBtn', function () {
    currentEditingSlideIndex = null;
    openSlideEditor();
});

// Edit Slide
$(document).on('click', '.slide-edit-btn', function () {
    const index = $(this).data('index');
    currentEditingSlideIndex = index;
    const slide = window.slideintro[index];
    openSlideEditor(slide);
});

// Delete Slide
$(document).on('click', '.slide-delete-btn', function () {
    const index = $(this).data('index');
    
    Swal.fire({
        title: 'Xác nhận xóa?',
        text: 'Bạn có chắc muốn xóa slide này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        customClass: {
            container: 'swal-high-zindex'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.slideintro.splice(index, 1);
            renderSlideList();
            Swal.fire({
                icon: 'success',
                title: 'Đã xóa!',
                text: 'Slide đã được xóa.',
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    container: 'swal-high-zindex'
                }
            });
        }
    });
});

// Move Slide Up
$(document).on('click', '.slide-move-up-btn', function () {
    const index = $(this).data('index');
    if (index > 0) {
        // Swap with previous slide
        const temp = window.slideintro[index];
        window.slideintro[index] = window.slideintro[index - 1];
        window.slideintro[index - 1] = temp;
        renderSlideList();
    }
});

// Move Slide Down
$(document).on('click', '.slide-move-down-btn', function () {
    const index = $(this).data('index');
    if (index < window.slideintro.length - 1) {
        // Swap with next slide
        const temp = window.slideintro[index];
        window.slideintro[index] = window.slideintro[index + 1];
        window.slideintro[index + 1] = temp;
        renderSlideList();
    }
});

// Open Slide Editor
function openSlideEditor(slide) {
    currentMediaUrl = ''; // Reset media URL
    
    if (slide) {
        $('#slideEditorTitle').text('Chỉnh sửa Slide');
        $('#slideMediaType').val(slide.mediaType || 'none');
        $('#slideTextContent').val(slide.text || '');
        
        // Show/hide media input group
        if (slide.mediaType && slide.mediaType !== 'none') {
            $('#slideMediaInputGroup').show();
            updateMediaLabel();
            previewMedia(slide.mediaUrl, slide.mediaType);
        } else {
            $('#slideMediaInputGroup').hide();
            $('#slideMediaPreview').html('');
        }
    } else {
        $('#slideEditorTitle').text('Thêm Slide Mới');
        $('#slideMediaType').val('none');
        $('#slideTextContent').val('');
        $('#slideMediaFile').val('');
        $('#slideMediaInputGroup').hide();
        $('#slideMediaPreview').html('');
    }
    
    $('#slideEditorModal').fadeIn();
}

// Close Slide Editor
$(document).on('click', '#closeSlideEditorModal, #cancelSlideEditorBtn', function () {
    $('#slideEditorModal').fadeOut();
});

// Media Type Change
$(document).on('change', '#slideMediaType', function () {
    const type = $(this).val();
    if (type === 'none') {
        $('#slideMediaInputGroup').hide();
        $('#slideMediaPreview').html('');
    } else {
        $('#slideMediaInputGroup').show();
        updateMediaLabel();
        $('#slideMediaFile').attr('accept', type === 'image' ? 'image/*' : 'video/*');
    }
});

// Update Media Label
function updateMediaLabel() {
    const type = $('#slideMediaType').val();
    const label = type === 'image' ? 'Chọn Hình ảnh:' : type === 'video' ? 'Chọn Video:' : 'Chọn File:';
    $('#slideMediaLabel').text(label);
}

// Preview media from file
let currentMediaUrl = '';

$(document).on('change', '#slideMediaFile', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            currentMediaUrl = e.target.result;
            const type = file.type.startsWith('image') ? 'image' : 'video';
            $('#slideMediaType').val(type);
            updateMediaLabel();
            previewMedia(currentMediaUrl, type);
        };
        reader.readAsDataURL(file);
    }
});

// Preview Media Function
function previewMedia(url, type) {
    const preview = $('#slideMediaPreview');
    
    if (!url || type === 'none') {
        preview.html('<p style="color: #999;">Chưa có media</p>').addClass('empty');
        return;
    }
    
    preview.removeClass('empty');
    
    if (type === 'image') {
        preview.html(`<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<p style=color:#f00>Không thể tải hình ảnh</p>'">`);
    } else if (type === 'video') {
        preview.html(`<video src="${url}" controls onerror="this.parentElement.innerHTML='<p style=color:#f00>Không thể tải video</p>'"></video>`);
    }
}

// Save Slide
$(document).on('click', '#saveSlideEditorBtn', function () {
    const mediaType = $('#slideMediaType').val();
    const text = $('#slideTextContent').val();
    
    // Use existing mediaUrl for editing or currentMediaUrl for new/changed media
    let mediaUrl = '';
    if (currentEditingSlideIndex !== null && window.slideintro[currentEditingSlideIndex]) {
        // Editing existing slide - use stored URL if no new file selected
        mediaUrl = currentMediaUrl || window.slideintro[currentEditingSlideIndex].mediaUrl || '';
    } else {
        // New slide
        mediaUrl = currentMediaUrl;
    }
    
    if (!mediaUrl && !text && mediaType !== 'none') {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'Vui lòng chọn file media hoặc nhập text!',
        });
        return;
    }
    
    if (!text && mediaType === 'none') {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'Vui lòng nhập nội dung text!',
        });
        return;
    }
    
    const slideData = {
        mediaType: mediaType,
        mediaUrl: mediaType !== 'none' ? mediaUrl : '',
        text: text
    };
    
    if (currentEditingSlideIndex !== null) {
        // Update existing slide
        window.slideintro[currentEditingSlideIndex] = slideData;
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã cập nhật slide!',
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        // Add new slide
        window.slideintro.push(slideData);
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã thêm slide mới!',
            timer: 1500,
            showConfirmButton: false
        });
    }
    
    currentMediaUrl = ''; // Reset after saving
    renderSlideList();
    $('#slideEditorModal').fadeOut();
});

// Save All Slides (just close modal, data is already saved)
$(document).on('click', '#saveAllSlidesBtn', function () {
    console.log('Saved slides:', window.slideintro);
    Swal.fire({
        icon: 'success',
        title: 'Đã lưu!',
        text: `Đã lưu ${window.slideintro.length} slide(s)`,
        timer: 2000,
        showConfirmButton: false
    });
    $('#slideCreatorModal').fadeOut();
    
    // Refresh slideshow if panel is open
    if ($('#gameSlideIntro').hasClass('active')) {
        initSlideshow();
    }
});

// Render Slide List
function renderSlideList() {
    const list = $('#slideCreatorList');
    
    if (window.slideintro.length === 0) {
        list.html(`
            <div class="slide-empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p>Chưa có slide nào. Nhấn "Thêm Slide Mới" để bắt đầu!</p>
            </div>
        `);
        return;
    }
    
    let html = '';
    window.slideintro.forEach((slide, index) => {
        let mediaHtml = '';
        if (slide.mediaUrl && slide.mediaType !== 'none') {
            if (slide.mediaType === 'image') {
                mediaHtml = `<img src="${slide.mediaUrl}" class="slide-item-media" alt="Slide ${index + 1}">`;
            } else if (slide.mediaType === 'video') {
                mediaHtml = `<video src="${slide.mediaUrl}" class="slide-item-media" controls></video>`;
            }
        }
        
        const textHtml = slide.text ? `<p class="slide-item-text">${slide.text}</p>` : '<p class="slide-item-text" style="color: #999; font-style: italic;">Không có text</p>';
        
        const moveUpDisabled = index === 0 ? 'disabled' : '';
        const moveDownDisabled = index === window.slideintro.length - 1 ? 'disabled' : '';
        
        html += `
            <div class="slide-item">
                <div class="slide-item-number">${index + 1}</div>
                <div class="slide-item-content">
                    ${mediaHtml}
                    ${textHtml}
                </div>
                <div class="slide-item-actions">
                    <button class="slide-move-btn slide-move-up-btn" data-index="${index}" ${moveUpDisabled}>
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>
                    <button class="slide-move-btn slide-move-down-btn" data-index="${index}" ${moveDownDisabled}>
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <button class="slide-edit-btn" data-index="${index}">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Sửa
                    </button>
                    <button class="slide-delete-btn" data-index="${index}">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Xóa
                    </button>
                </div>
            </div>
        `;
    });
    
    list.html(html);
}

// Initialize on document ready
$(document).ready(function () {
    console.log('GameSlideIntro initialized. window.slideintro:', window.slideintro);
});
