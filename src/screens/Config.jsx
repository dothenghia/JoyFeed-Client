

const Config = () => {
    return (
        <div className="max-w-3xl mx-auto px-5 sm:px-10 h-full pt-6">

            <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="w-fit">
                    <label htmlFor="meals" className="form-label">Số bữa ăn</label>

                    <div className="flex mb-4 sm:mb-0">
                        <button className="custom-primary-fade-btn px-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                        <input
                            type="number"
                            id="meals"
                            className="form-input m-0 w-14 text-center mx-2"
                            value={3}
                        />
                        <button className="custom-primary-fade-btn px-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                    </div>
                </div>

                <div className="w-fit">
                    <label htmlFor="sound" className="form-label">Âm thanh</label>
                    <select id="sound" className="form-input m-0">
                        <option value="Tiếng gọi hoang dã">Tiếng gọi hoang dã</option>
                        <option value="Sao em lại không nói">Sao em lại không nói</option>
                        <option value="Tìm em trong bóng damn">Tìm em trong bóng damn</option>
                    </select>
                </div>
            </div>

            <div>
                <div className="px-4 pt-3 pb-2 border border-1 border-border rounded-xl overflow-hidden">
                    <h1 className="text-lg font-semibold mb-2">Lần 1</h1>

                    <div>
                        <label htmlFor="sound" className="form-label-inline">Thời gian: </label>
                        <input type="time" className="form-input-inline" />
                    </div>

                    <div>
                        <label htmlFor="sound" className="form-label-inline">Khối lượng: </label>
                        <input type="number" className="form-input-inline w-28" />
                        <span className="text-base font-medium text-text ml-2">gram</span>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <button type="submit" className="custom-primary-btn">Lưu thông tin</button>
            </div>
        </div>
    )
}

export default Config