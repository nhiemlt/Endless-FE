import moment from "moment";
import { useEffect, useState } from "react";
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'; // Icon con mắt
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";
import Datepicker from "react-tailwindcss-datepicker";
import { RECENT_TRANSACTIONS } from "../../utils/dummyData";

const TopSideButtons = ({ applySearch, updateDateRange, sortTransactions }) => {
    const [searchText, setSearchText] = useState("");

    const minDate = moment(Math.min(...RECENT_TRANSACTIONS.map(t => new Date(t.date)))).format("DD-MM-YYYY");
    const maxDate = moment(Math.max(...RECENT_TRANSACTIONS.map(t => new Date(t.date)))).format("DD-MM-YYYY");

    const [dateValue, setDateValue] = useState({
        startDate: moment(minDate, "DD-MM-YYYY").toDate(),
        endDate: moment(maxDate, "DD-MM-YYYY").toDate(),
    });

    const handleDatePickerValueChange = (newValue) => {
        setDateValue(newValue);
        updateDateRange(newValue);
    };

    useEffect(() => {
        if (searchText === "") {
            applySearch("");
        } else {
            applySearch(searchText);
        }
    }, [searchText]);

    return (
        <div className="flex justify-start items-center space-x-4">
            <SearchBar searchText={searchText} styleClass="w-60" setSearchText={setSearchText} />
            <div className="flex items-center space-x-4">
                <Datepicker
                    containerClassName="w-62 inline-block"
                    value={dateValue}
                    inputClassName="input input-bordered w-55 h-9"
                    displayFormat={"DD-MM-YYYY"}
                    onChange={handleDatePickerValueChange}
                />
                <div className="dropdown dropdown-bottom dropdown-end">
                    <label tabIndex={0} className="btn btn-sm btn-outline">
                        <FunnelIcon className="w-5 mr-2" />Sort
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 text-sm z-[1] shadow bg-base-100 rounded-box w-52">
                        <li><a onClick={() => sortTransactions('amountAsc')}>Amount - Ascending</a></li>
                        <li><a onClick={() => sortTransactions('amountDesc')}>Amount - Descending</a></li>
                        <li><a onClick={() => sortTransactions('dateAsc')}>Date - Ascending</a></li>
                        <li><a onClick={() => sortTransactions('dateDesc')}>Date - Descending</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

function Transactions() {
    const [trans, setTrans] = useState(RECENT_TRANSACTIONS);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 8;
    const [selectedTransaction, setSelectedTransaction] = useState(null); // Lưu giao dịch được chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

    const sortTransactions = (sortType) => {
        let sortedTransactions = [...trans];

        switch (sortType) {
            case 'amountAsc':
                sortedTransactions.sort((a, b) => a.amount - b.amount);
                break;
            case 'amountDesc':
                sortedTransactions.sort((a, b) => b.amount - a.amount);
                break;
            case 'dateAsc':
                sortedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'dateDesc':
                sortedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default:
                break;
        }
        setTrans(sortedTransactions);
        setCurrentPage(1);
    };

    const applySearch = (value) => {
        let filteredTransactions = RECENT_TRANSACTIONS.filter((t) =>
            t.email.toLowerCase().includes(value.toLowerCase())
        );
        setTrans(filteredTransactions);
        setCurrentPage(1);
    };

    const updateDateRange = ({ startDate, endDate }) => {
        let filteredTransactions = RECENT_TRANSACTIONS.filter((t) => {
            const transactionDate = moment(t.date);
            return transactionDate.isBetween(moment(startDate), moment(endDate), 'days', '[]');
        });
        setTrans(filteredTransactions);
        setCurrentPage(1);
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction); // Lưu giao dịch đã chọn
        setIsModalOpen(true); // Mở modal
    };

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = trans.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const totalPages = Math.ceil(trans.length / transactionsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <TitleCard topMargin="mt-1" TopSideButtons={<TopSideButtons applySearch={applySearch} sortTransactions={sortTransactions} updateDateRange={updateDateRange} />} >
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Id</th>
                                <th>Location</th>
                                <th>Amount</th>
                                <th>Transaction Date</th>
                                <th>Action</th> {/* Cột mới cho hành động */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((l, k) => (
                                <tr key={k}>
                                    <td>
                                        <div className="flex items-center space-x-1">
                                            <div className="avatar">
                                                <div className="mask mask-circle w-12 h-8">
                                                    <img src={l.avatar} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{l.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{l.email}</td>
                                    <td>{l.location}</td>
                                    <td>${l.amount}</td>
                                    <td>{moment(l.date).format("DD-MM-YYYY")}</td>
                                    <td>
                                        <button onClick={() => handleViewDetails(l)} className="btn btn-sm btn-outline">
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="join mt-4 flex justify-center w-full">
                    <button onClick={handlePrevPage} className="join-item btn" disabled={currentPage === 1}>
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => handlePageClick(i + 1)} className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}>
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={handleNextPage} className="join-item btn" disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </TitleCard>

            {/* Modal chi tiết giao dịch */}
            {isModalOpen && selectedTransaction && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Transaction Details</h3>
                        <p className="py-2">Name: {selectedTransaction.name}</p>
                        <p className="py-2">Email: {selectedTransaction.email}</p>
                        <p className="py-2">Location: {selectedTransaction.location}</p>
                        <p className="py-2">Amount: ${selectedTransaction.amount}</p>
                        <p className="py-2">Transaction Date: {moment(selectedTransaction.date).format("DD-MM-YYYY")}</p>
                        <div className="modal-action">
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-outline">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Transactions;
