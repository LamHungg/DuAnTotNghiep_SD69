
# HƯỚNG DẪN MIGRATION CSS ADMIN

## Các thay đổi chính:

### 1. Layout Classes
- `dashboard-container` → `admin-layout`
- `dashboard-header` → `card-header`
- `dashboard-title` → `card-title`

### 2. Stats Classes
- `stats-grid` → `stats-grid` (giữ nguyên)
- `stat-card` → `stat-card` (giữ nguyên)
- `stat-title` → `stat-card-label`
- `stat-value` → `stat-card-value`

### 3. Button Classes
- `btn btn-primary` → `btn btn-primary` (giữ nguyên)
- `btn btn-success` → `btn btn-success` (giữ nguyên)
- `btn btn-outline-primary` → `btn btn-outline`

### 4. Table Classes
- `table` → `table` (giữ nguyên)
- `table-hover` → `table-hover` (giữ nguyên)

### 5. Form Classes
- `form-group` → `form-group` (giữ nguyên)
- `form-control` → `form-control` (giữ nguyên)

### 6. Modal Classes
- `modal` → `modal` (giữ nguyên)
- `modal-dialog` → `modal-dialog` (giữ nguyên)

### 7. Badge Classes
- `badge bg-primary` → `badge badge-primary`
- `badge bg-success` → `badge badge-success`

### 8. Status Classes
- `status-active` → `status-badge status-active`
- `status-inactive` → `status-badge status-inactive`

### 9. Action Buttons
- `btn-edit` → `action-btn action-btn-edit`
- `btn-delete` → `action-btn action-btn-delete`

### 10. Utility Classes
- `text-center` → `text-center` (giữ nguyên)
- `d-flex` → `d-flex` (giữ nguyên)
- `justify-content-between` → `justify-between`
- `align-items-center` → `align-center`

## Cách sử dụng CSS Variables:

### Colors
```css
color: var(--primary-color);
background: var(--success-color);
```

### Spacing
```css
padding: var(--spacing-lg);
margin: var(--spacing-md);
```

### Typography
```css
font-size: var(--font-size-xl);
font-weight: var(--font-weight-semibold);
```

### Shadows
```css
box-shadow: var(--shadow-lg);
```

## Responsive Design:

### Breakpoints
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

### Usage
```css
@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }
}
```

## Thời gian migration: 17:23:57 29/8/2025
