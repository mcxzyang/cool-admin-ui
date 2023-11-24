import { Modal, ModalReturn } from '@arco-design/web-vue';

let modalInstance: ModalReturn | null;
const modalErrorWrapper = (options: any) => {
  if (modalInstance) {
    modalInstance.close();
  }
  modalInstance = Modal.confirm(options);
};

export default modalErrorWrapper;
