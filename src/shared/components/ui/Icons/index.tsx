import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// ============================================================
// NAVIGATION & LAYOUT ICONS
// ============================================================

export const SearchIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
  </svg>
)

export const MenuIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
  </svg>
)

export const OpenSidebarIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M3 6h2v12H3V6zm3 0h12v2H6V6zm0 5h12v2H6v-2zm0 5h12v2H6v-2z"/>
  </svg>
)

export const ExitIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
)

export const LogoutIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
)

// ============================================================
// NAVIGATION - CHEVRON ICONS
// ============================================================

export const ChevronUpIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"/>
  </svg>
)

export const ChevronDownIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
)

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
  </svg>
)

export const ChevronRightIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
  </svg>
)

// ============================================================
// ACTION ICONS (Create, Edit, Delete, Save)
// ============================================================

export const PlusIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
  </svg>
)

export const EditIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className} width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
  </svg>
)

export const TrashIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className} width={size} height={size}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
  </svg>
)

export const SaveIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
  </svg>
)

export const ClearIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
  </svg>
)

export const XIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
)

export const CloseIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
)

// ============================================================
// USER & AUTHENTICATION ICONS
// ============================================================

export const UserIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
  </svg>
)

export const UsersIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
)

export const UserSidebarIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
)

export const ShieldIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
)

// ============================================================
// ENTITY ICONS (Product, Category, Supplier, etc.)
// ============================================================

export const ProductIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

export const ProductsIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

export const CatalogIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/>
  </svg>
)

export const CategoryIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

export const SupplierIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9h10v2H7z"/>
  </svg>
)

export const ShoppingCartIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z"/>
  </svg>
)

export const ShopIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
  </svg>
)

export const FerreteriaIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M11 22h2v-2h-2v2zm6-11h2V9h-2v2zM3 14h2v-2H3v2zm13 0h6v-2h-6v2zM3 9h2V7H3v2zm13-2v2h6V7h-6zm0 11h6v-2h-6v2z"/>
  </svg>
)

// ============================================================
// CONTACT INFORMATION ICONS
// ============================================================

export const EmailIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
  </svg>
)

export const PhoneIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.608.8c.15.3.7 1.337 1.932 3.103C5.1 10.256 6.892 12.953 8.877 15.5h.01l.01.002h.002l1.643-.822a1 1 0 011.06.54l.799 2.252a1 1 0 01-.823 1.12l-2.351.263a24.797 24.797 0 01-5.861-2.752C5.364 15.863 2.776 12.346 2.896 8.615 2.93 7.62 2.964 6.331 2.996 5.625A1 1 0 012 5.05V3z"/>
  </svg>
)

export const AddressIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5z"/>
  </svg>
)

export const DocumentNumberIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
  </svg>
)

export const DocumentTypeIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
  </svg>
)

export const GenderIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 15.5c1.93 0 3.5-1.57 3.5-3.5S13.93 8.5 12 8.5s-3.5 1.57-3.5 3.5 1.57 3.5 3.5 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>
)

// ============================================================
// INFORMATION & STATUS ICONS
// ============================================================

export const PriceIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h4v-2h-4v2zm0-4h4v-2h-4v2zm0-4h4V7h-4v2z"/>
  </svg>
)

export const DescriptionIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)

export const VolumeIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
)

export const ImageIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)

export const KeyIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2z"/>
  </svg>
)

export const ImageIcon2: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
)

// ============================================================
// STATUS & ALERTS ICONS
// ============================================================

export const SuccessIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
)

export const AlertsIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
)

export const InexistIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
)

// ============================================================
// CATEGORIZATION ICONS (Tags, Permissions, Roles, etc.)
// ============================================================

export const TagIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M5.5 2a1.5 1.5 0 00-1.5 1.5v3H2a2 2 0 00-2 2v3a2 2 0 002 2h3v3a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-3h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3v-3A1.5 1.5 0 008.5 2h-3z" clipRule="evenodd"/>
  </svg>
)

export const PermissionIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>
)

export const PermissionsSidebarIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2z"/>
  </svg>
)

export const RolesIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

export const RuleIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
)

export const LevelIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2z"/>
  </svg>
)

// ============================================================
// TIME & SCHEDULE ICONS
// ============================================================

export const TimeDateIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5h5v5h-5z"/>
  </svg>
)

export const CalendarIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
  </svg>
)

// ============================================================
// SYSTEM & ADMIN ICONS
// ============================================================

export const DashboardIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM11 4a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
  </svg>
)

export const CogIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
  </svg>
)

export const SettingsIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.1-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.1.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
)

// ============================================================
// DELIVERY & LOGISTICS ICONS
// ============================================================

export const TruckIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5M5 9.5v6h6v-6M2 6.5h13v9h-13z"/>
  </svg>
)

export const DeploymentIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9h10v2H7z"/>
  </svg>
)

// ============================================================
// APPEARANCE & THEME ICONS
// ============================================================

export const SunIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
  </svg>
)

export const MoonIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" width={size} height={size}>
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
  </svg>
)

export const ColorIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

// ============================================================
// MISCELLANEOUS ICONS
// ============================================================

export const CompanyIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm4 8H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
  </svg>
)

export const CreditCardIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M20 8H4V4h16m0 12H4v4h16m0-8H4v4h16z"/>
  </svg>
)

export const GiftCardIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M20 6h-2.18c.11-.31.18-.645.18-1a2.5 2.5 0 0 0-5-1c-.359 0-.696.047-1.025.135A2.5 2.5 0 0 0 9 5c0 .355.057.691.16 1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-5-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1zM9 4.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/>
  </svg>
)

export const TermsIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
  </svg>
)

export const IpAddressIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)

export const LookIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
)

export const PriorityIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
)

export const ChangesIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

export const AuditLogIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
  </svg>
)

export const CircleIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <circle cx="12" cy="12" r="10"/>
  </svg>
)

export const RayoIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M13 2l.39 1.17h1.23l-1 .73.39 1.17L13 4.1l-1 .73.39-1.17-1-.73h1.23L13 2zm-4 7l.39 1.17h1.23l-1 .73.39 1.17L9 11l-1 .73.39-1.17-1-.73h1.23L9 9zm8 0l.39 1.17h1.23l-1 .73.39 1.17L17 11l-1 .73.39-1.17-1-.73h1.23L17 9z"/>
  </svg>
)

export const WrenchIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.6C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
  </svg>
)

export const FirefoxIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>
)