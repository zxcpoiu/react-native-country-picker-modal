import * as React from 'react'
import {
  ModalProps,
  Modal as DefaultModal,
  SafeAreaView,
  StyleSheet,
  Platform
} from 'react-native'

// @ts-ignore
import WebModal from 'modal-react-native-web'

import { useTheme } from './CountryTheme'

const Modal = Platform.select<typeof DefaultModal>({
  web: WebModal,
  default: DefaultModal
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export const CountryModal = ({
  children,
  ...props
}: ModalProps & { children: React.ReactNode }) => {
  const { backgroundColor } = useTheme()

  return (
    <Modal {...props}>
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {children}
      </SafeAreaView>
    </Modal>
  )
}

CountryModal.defaultProps = {
  animationType: 'slide',
  animated: true
}
