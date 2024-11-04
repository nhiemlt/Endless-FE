import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TitleCard from '../../components/Cards/TitleCard';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

function Pay() {
  return (
    <TitleCard>
      <div className="max-lg:max-w-xl mx-auto w-full flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="lg:col-span-2 max-lg:order-1 p-3 max-w-4xl mx-auto w-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white inline-block border-b-2 border-gray-800 dark:border-gray-300 pb-1">Cổng thanh toán VNPAY</h2>
          </div>
          <form className="lg:mt-16">
            <div className="flex gap-12 mt-8">
              <div className="w-1/2">
                <img
                  src="https://kalite.vn/wp-content/uploads/2021/09/maqrkalite.jpg"
                  alt="QR Code"
                  className="w-full h-auto"
                />
                <p className="font-bold text-center mt-5 text-lg">Số tiền cần thanh toán: 100.000.000</p>
              </div>
              <div className="w-1/2">
                <div className="mb-5 flex items-center border-b border-gray-300 dark:border-gray-600">
                  <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Tên chủ thẻ*"
                    className="px-2 pb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500"
                  />
                </div>

                <div className="mb-5 flex items-center border-b border-gray-300 dark:border-gray-600">
                  <CreditCardIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Số thẻ*"
                    className="px-2 pb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-5">
                  <div className="flex items-center border-b border-gray-300 dark:border-gray-600">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <input
                      type="number"
                      placeholder="Ngày phát hành*"
                      className="px-2 pb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="CVV*"
                      className="px-2 pb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-full text-sm border-b border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <label htmlFor="remember-me" className="ml-3 block text-sm flex items-center">
                    Điều kiện sử dụng dịch vụ
                    <ExclamationCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 ml-1" />
                  </label>
                </div>
                <div className="flex w-full flex-col border-opacity-50 mt-10">
                  <div className="btn bg-blue-600 text-white place-items-center mb-2 mt-5">Xác nhận</div>
                  <div className="divider">Hoặc</div>
                  <div className="btn bg-zinc-500 text-white place-items-center">Hủy</div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Sử dụng ứng dụng hỗ trợ VNPAY</h2>
            </div>
          </form>
        </div>
      </div >
    </TitleCard >
  );
}

export default Pay;
