import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useNotifications from '../../../hooks/useNotifications'
import NotificationService from '../../../services/NotificationService'
import { markNotificationAsRead } from '../../../features/common/headerSlice'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'

function NotificationBodyRightDrawer ({ closeRightDrawer }) {
  const { notifications, loading, error } = useNotifications()
  const [localNotifications, setLocalNotifications] = useState(notifications)
  const dispatch = useDispatch()

  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const handleMarkAsRead = async (notificationRecipientId, isRead) => {
    if (!isRead) {
      try {
        const message = await NotificationService.markAsRead(
          notificationRecipientId
        )
        setLocalNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.notificationRecipientID === notificationRecipientId
              ? { ...notification, status: 'Đã đọc' }
              : notification
          )
        )
      } catch (error) {
        console.error('Lỗi khi đánh dấu đã đọc:', error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const message = await NotificationService.markAllAsRead()
      setLocalNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          status: 'Đã đọc'
        }))
      )
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả là đã đọc:', error)
    }
  }

  const handleDeleteNotification = async notificationRecipientID => {
    try {
      await NotificationService.deleteNotificationReception(
        notificationRecipientID
      )
      setLocalNotifications(prevNotifications =>
        prevNotifications.filter(
          notification =>
            notification.notificationRecipientID !== notificationRecipientID
        )
      )
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error)
    }
  }

  if (loading) {
    return <div>Đang tải thông báo...</div>
  }

  if (error) {
    return <div>Lỗi khi tải thông báo: {error.message}</div>
  }

  return (
    <div className='w-full p-4'>
      <button
        onClick={handleMarkAllAsRead}
        className='btn btn-outline btn-success w-full mb-2'
      >
        Đánh dấu tất cả là đã đọc
      </button>
      {localNotifications.length > 0 ? (
        localNotifications.map(notification => (
          <div
            key={notification.notificationRecipientID}
            className={`flex items-center justify-between bg-base-200 rounded-box p-3 mt-2 cursor-pointer ${
              notification.status === 'UNREAD' ? 'font-bold' : ''
            }`}
            onClick={() =>
              handleMarkAsRead(
                notification.notificationRecipientID,
                notification.status === 'READ'
              )
            }
          >
            <div className='flex-1'>
              <div className='text-xs text-gray-500'>
                Vào{' '}
                {new Date(notification.date).toLocaleString('vi-VN', {
                  weekday: 'long', // Hiển thị thứ
                  year: 'numeric', // Năm
                  month: 'long', // Tháng (ví dụ: Tháng Mười Hai)
                  day: 'numeric', // Ngày
                  hour: 'numeric', // Giờ
                  minute: 'numeric', // Phút
                  second: 'numeric' // Giây
                })}
              </div>
              <div
                className={`font-semibold ${
                  notification.status === 'Chưa đọc' ? 'text-blue-600' : ''
                }`}
              >
                {notification.notificationTitle}
              </div>
              <div className='text-sm mt-1'>{notification.content}</div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation()
                handleDeleteNotification(notification.notificationRecipientID)
              }}
              className='btn btn-outline btn-error rounded-full w-8 h-8 p-0 ml-2'
            >
              <TrashIcon className='w-5 h-5' />
            </button>
          </div>
        ))
      ) : (
        <div>Không có thông báo nào.</div>
      )}
    </div>
  )
}

export default NotificationBodyRightDrawer
