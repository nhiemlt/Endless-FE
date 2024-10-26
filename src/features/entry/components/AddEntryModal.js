
function AddEntryModal({ showModal}) {
return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Tạo nhập hàng</h3>
            <form>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tên sản phẩm</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={""} 
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Số lượng</span>
                </label>
                <input 
                  type="number" 
                  min="0"
                  className="input input-bordered" 
                  value={""} 
                  placeholder="Nhập số lượng"
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-primary">
                  Lưu
                </button>
                <button type="button" className="btn">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

}