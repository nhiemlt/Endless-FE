import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import StaffService from '../../../services/StaffService'
import { showNotification } from '../../common/headerSlice'
import UploadFileService from '../../../services/UploadFileService'
import RoleService from '../../../services/roleService'

const AddEmployeeModal = ({ showModal, closeModal, fetchEmployees }) => {
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [roles, setRoles] = useState([]) // Danh sách vai trò từ API
  const [selectedRoles, setSelectedRoles] = useState([]) // Vai trò đã chọn
  const [employeeData, setEmployeeData] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: ''
  })

  // Fetch danh sách vai trò khi modal mở
  useEffect(() => {
    if (showModal) {
      const fetchRoles = async () => {
        try {
          const rolesData = await RoleService.getAll()
          if (Array.isArray(rolesData)) {
            const roleOptions = rolesData.map(role => ({
              value: role.roleId,
              label: role.roleName
            }))
            setRoles(roleOptions)
          } else {
            throw new Error('Invalid roles data format')
          }
        } catch (error) {
          console.error('Failed to fetch roles:', error)
          dispatch(
            showNotification({
              message: 'Lỗi khi tải danh sách vai trò.',
              status: 0
            })
          )
        }
      }
      fetchRoles()
    }
  }, [showModal, dispatch])

  // Xử lý thay đổi avatar
  const handleAvatarChange = event => {
    const file = event.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // Xử lý thay đổi vai trò
  const handleRoleChange = (selectedOptions) => {
    console.log('Vai trò đã chọn:', selectedOptions) // Log vai trò đã chọn
    setSelectedRoles(selectedOptions || []) // Cập nhật các vai trò đã chọn
  }

  // Xử lý thêm nhân viên
  const handleAddEmployee = async event => {
    event.preventDefault()

    if (
      !employeeData.username ||
      !employeeData.fullname ||
      !employeeData.email ||
      !employeeData.phone
    ) {
      dispatch(
        showNotification({
          message: 'Vui lòng điền đầy đủ thông tin.',
          status: 0
        })
      )
      return
    }

    // Validate email và phone
    if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
      dispatch(showNotification({ message: 'Email không hợp lệ.', status: 0 }))
      return
    }

    if (!/^\d{10}$/.test(employeeData.phone)) {
      dispatch(
        showNotification({
          message: 'Số điện thoại phải là 10 chữ số.',
          status: 0
        })
      )
      return
    }

    try {
      // Upload avatar nếu có
      let avatarUrl = null
      if (avatar) {
        avatarUrl = await UploadFileService.uploadUserImage(avatar)
      }

      // Dữ liệu nhân viên
      const newEmployee = {
        ...employeeData,
        roleIds: selectedRoles.map(role => role.value), // Lấy danh sách ID vai trò đã chọn
        avatar: avatarUrl || 'https://example.com/default-avatar.png' // Avatar mặc định nếu không chọn
      }

      console.log('Dữ liệu gửi đi', newEmployee)

      await StaffService.addEmployee(newEmployee)

      dispatch(
        showNotification({ message: 'Thêm nhân viên thành công.', status: 1 })
      )

      fetchEmployees() // Cập nhật lại danh sách nhân viên
      setEmployeeData({
        username: '',
        fullname: '',
        email: '',
        phone: ''
      })
      setAvatar(null)
      setAvatarPreview('')
      setSelectedRoles([]) // Reset lại vai trò đã chọn
      closeModal() // Đóng modal sau khi thành công
    } catch (error) {
      console.error(
        'Không thể thêm nhân viên:',
        error.response ? error.response.data : error.message
      )
      dispatch(
        showNotification({
          message: `Thêm nhân viên thất bại: ${
            error.response?.data?.message || 'Lỗi không xác định'
          }`,
          status: 0
        })
      )
    }
  }

  return (
    <div className={`modal ${showModal ? 'modal-open' : ''}`}>
      <div className='modal-box w-full max-w-3xl lg:max-w-4xl'>
        <form onSubmit={handleAddEmployee}>
          <h2 className='font-bold text-lg'>Thêm nhân viên mới</h2>

          {/* Avatar */}
          <div className='flex flex-col items-center mb-4 mt-5'>
            <div className='avatar'>
              <div className='ring-secondary ring-offset-base-100 rounded-full ring ring-offset-2'>
                <div
                  className='mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full cursor-pointer'
                  style={{
                    backgroundImage: `url(${
                      avatarPreview || 'https://example.com/default-avatar.png'
                    })`,
                    backgroundSize: 'cover'
                  }}
                  onClick={() =>
                    document.getElementById('upload_avatar').click()
                  }
                >
                  <input
                    type='file'
                    id='upload_avatar'
                    hidden
                    accept='image/*'
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chọn vai trò */}
          <div className='mb-4'>
            <label className='label'>Chọn vai trò:</label>
            <Select
              options={roles}
              isMulti
              value={selectedRoles || []}
              onChange={handleRoleChange}
              placeholder='Nhập để tìm kiếm vai trò...'
            />
          </div>

          {/* Thông tin nhân viên */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            {[{ label: 'Tên người dùng', field: 'username' }, { label: 'Họ và tên', field: 'fullname' }, { label: 'Email', field: 'email' }, { label: 'Số điện thoại', field: 'phone' }].map(({ label, field }, idx) => (
              <div key={idx}>
                <label className='label'>{label}:</label>
                <input
                  type='text'
                  value={employeeData[field]}
                  onChange={e =>
                    setEmployeeData({
                      ...employeeData,
                      [field]: e.target.value
                    })
                  }
                  className='input input-bordered w-full'
                />
              </div>
            ))}
          </div>

          {/* Hành động */}
          <div className='modal-action'>
            <button type='submit' className='btn btn-primary'>
              Thêm nhân viên
            </button>
            <button type='button' className='btn' onClick={closeModal}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployeeModal
