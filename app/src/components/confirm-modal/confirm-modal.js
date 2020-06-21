import React from 'react';

const ConfirmModal = ({modal, target, method}) => {
    return (
        <div id={target} uk-modal={modal.toString()}>
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Сохранение</h2>
                <p>Вы действительно хотите сохранить изменеия?</p>
                <p className="uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-small-right uk-modal-close " type="button">Отменить</button>
                    <button 
                        className="uk-button uk-button-primary uk-modal-close" 
                        type="button"
                        onClick={() => method()}>Сохранить</button>
                </p>
            </div>
        </div> 
    )
    
};
export default ConfirmModal;