import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useDispatch } from 'react-redux'
import EmployeeService from '../../../services/StaffService'
import { showNotification } from '../../common/headerSlice'
import UploadFileService from '../../../services/UploadFileService'
import RoleService from '../../../services/roleService'

const UpdateEmployeeModal = ({
  showModal,
  closeModal,
  employee,
  fetchEmployees
}) => {
  const dispatch = useDispatch()
  const [employeeData, setEmployeeData] = useState({
    username: '',
    fullname: '',
    phone: '',
    email: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [roles, setRoles] = useState([]) // Danh sách vai trò từ API
  const [userRoles, setUserRoles] = useState([]) // Vai trò đã chọn của người dùng

  const defaultAvatar = 'https://example.com/default-avatar.png'

  // Fetch danh sách roles từ API
  useEffect(() => {
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
  }, [dispatch])

  // Load thông tin nhân viên từ props
  useEffect(() => {
    if (employee) {
      setEmployeeData({
        username: employee.username || '',
        fullname: employee.fullname || '',
        phone: employee.phone || '',
        email: employee.email || ''
      })
      setAvatarPreview(employee.avatar || defaultAvatar)

      // Xử lý roles của nhân viên
      if (employee.roles) {
        const selectedRoles = employee.roles.map(role => ({
          value: role.roleId,
          label: role.roleName
        }))
        console.log("Dữ liệu hiện tại", )
        setUserRoles(selectedRoles)
      }
    }
  }, [employee])

  const handleAvatarChange = event => {
    const file = event.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRoleChange = (selectedRoles) => {
    const uniqueRoles = selectedRoles.filter((role, index, self) =>
      index === self.findIndex((t) => t.value === role.value)
    );
    setUserRoles(uniqueRoles); 
    console.log("Các vai trò đã chọn:", uniqueRoles);
  };
  


  const handleUpdateEmployee = async event => {
    event.preventDefault();
    setIsLoading(true);

    // Validate form
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
      );
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
      dispatch(showNotification({ message: 'Email không hợp lệ.', status: 0 }));
      setIsLoading(false);
      return;
    }

    try {
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await UploadFileService.uploadUserImage(avatar);
      }

      const updatedEmployeeData = {
        ...employeeData,
        avatar: avatarUrl || employee.avatar,
        roleIds: userRoles.map((role) => role.value) // Lấy roleId từ userRoles đã chọn
      };

      console.log('Dữ liệu cập nhật', updatedEmployeeData);

      await EmployeeService.updateEmployee(employee.userID, updatedEmployeeData);

      dispatch(
        showNotification({
          message: 'Cập nhật nhân viên thành công.',
          status: 1
        })
      );
      fetchEmployees(); // Lấy lại danh sách nhân viên
      closeModal(); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error('Cập nhật nhân viên thất bại:', error);
      dispatch(
        showNotification({
          message: `Cập nhật thất bại: ${
            error.response?.data?.message || 'Lỗi không xác định'
          }`,
          status: 0
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className={`modal ${showModal ? 'modal-open' : ''}`}>
      <div className='modal-box w-full max-w-3xl lg:max-w-4xl'>
        <form onSubmit={handleUpdateEmployee}>
          <h2 className='font-bold text-lg mb-4'>
            Cập nhật thông tin nhân viên
          </h2>

          {/* Avatar */}
          <div className='flex flex-col items-center mb-6'>
            <div
              className='relative w-[140px] h-[140px] rounded-full bg-gray-200'
              style={{
                backgroundImage: `url(${avatarPreview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={() =>
                document.getElementById('upload_avatarUpdate').click()
              }
              title='Thay đổi ảnh đại diện'
            >
              <input
                type='file'
                id='upload_avatarUpdate'
                hidden
                accept='image/*'
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='label'>Chọn vai trò:</label>
            <Select
              options={roles} // Danh sách roles từ API
              value={userRoles} // Danh sách roles đã chọn
              onChange={handleRoleChange} // Cập nhật userRoles khi thay đổi
              isMulti
              placeholder='Chọn vai trò...'
            />
          </div>

          {/* Các input */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
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

          {/* Actions */}
          <div className='modal-action'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={isLoading}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật nhân viên'}
            </button>
            <button type='button' className='btn' onClick={closeModal}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmployeeModal