document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const galleryGrid = document.getElementById('galleryGrid');
    const imageUrlInput = document.getElementById('imageUrl');
    const addImageBtn = document.getElementById('addImageBtn');
    const deleteImageBtn = document.getElementById('deleteImageBtn');
    let selectedImage = null;

    // Función para mostrar notificación
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `gallery-notification notification-${type}`;
        notification.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                ${type === 'success' ? 
                    '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>' :
                type === 'error' ?
                    '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>' :
                    '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>'}
            </svg>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Función mejorada para validar URL de imagen
    function isValidImageUrl(url) {
        try {
            new URL(url);
            
            // Patrón más flexible para extensiones de imagen
            const imagePattern = /\.(jpe?g|png|gif|bmp|webp|avif|svg|jfif|pjpeg|pjp|tiff?|ico|heic|heif)(\?.*)?$/i;
            
            // Verificar si la URL termina con extensión de imagen o contiene /photo/ o /image/
            return imagePattern.test(url) || 
                   /\/photo\//i.test(url) || 
                   /\/image\//i.test(url) ||
                   /\.(facebook|fbcdn|instagram|twimg|flickr|imgur)\./i.test(url);
        } catch {
            return false;
        }
    }

    // Función para crear elemento de imagen
    function createImageElement(url) {
        const item = document.createElement('div');
        item.className = 'gallery-item added';
        
        const img = document.createElement('img');
        img.src = url;
        img.className = 'gallery-img';
        img.alt = 'Momento compartido en Bar Amigo';
        img.loading = 'lazy';
        
        // Manejar error de carga de imagen
        img.onerror = function() {
            item.classList.add('image-error');
            img.alt = 'No se pudo cargar la imagen';
            item.innerHTML = '<div class="error-message">Imagen no disponible</div>';
        };
        
        item.appendChild(img);
        
        item.addEventListener('click', function() {
            if (selectedImage) {
                selectedImage.classList.remove('selected');
            }
            this.classList.add('selected');
            selectedImage = this;
            deleteImageBtn.disabled = false;
        });
        
        return item;
    }

    // Función para agregar imagen
    function addImage() {
        const imageUrl = imageUrlInput.value.trim();
        
        if (!imageUrl) {
            showNotification('Por favor ingresa una URL de imagen', 'error');
            imageUrlInput.focus();
            return;
        }
        
        if (!isValidImageUrl(imageUrl)) {
            showNotification('URL no válida. Asegúrate que sea un enlace directo a una imagen', 'error');
            imageUrlInput.focus();
            return;
        }
        
        const imgElement = createImageElement(imageUrl);
        galleryGrid.prepend(imgElement);
        
        imageUrlInput.value = '';
        imageUrlInput.focus();
        showNotification('¡Imagen agregada! Comparte más momentos con nosotros.');
    }

    // Función para eliminar imagen seleccionada
    function deleteSelectedImage() {
        if (selectedImage) {
            selectedImage.style.transform = 'scale(0.9)';
            selectedImage.style.opacity = '0';
            
            setTimeout(() => {
                selectedImage.remove();
                selectedImage = null;
                deleteImageBtn.disabled = true;
                showNotification('Imagen eliminada', 'info');
            }, 300);
        }
    }

    // Event listeners
    addImageBtn.addEventListener('click', addImage);
    
    imageUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addImage();
        }
    });
    
    deleteImageBtn.addEventListener('click', deleteSelectedImage);

    // Cargar imágenes de ejemplo
    const sampleImages = [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1546171753-97d7676e4602?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    ];

    sampleImages.forEach(url => {
        const imgElement = createImageElement(url);
        galleryGrid.appendChild(imgElement);
    });
});