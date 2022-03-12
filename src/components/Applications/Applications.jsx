import { CheckOutlined } from '@ant-design/icons'
import { Card, Col, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import style from './Application.module.css'

const Applications = (props) => {
    const [data, setData] = useState()
    const baseUrl = 'https://polymer-additives.specialchem.com'

    const getApplications = () => {
        axios.get('http://127.0.0.1:9080/crawl.json', {
            params: {
                spider_name: 'applications',
                start_requests: true,
            }
        }).then((response) => {
            setData(response.data?.items[0])
        })
    }

    useEffect(() => {
        getApplications()
    }, [])


    return (
        <Modal
            visible={props.modalVisible}
            width='1200px'
            destroyOnClose
            onCancel={() => {
                props.setApplicationModalVisible(false)
            }}
            footer={null}>
            <div style={{ marginTop: '25px' }}>
                <Row gutter={[16, 16]} >
                    {
                        data?.applications.map((ikey) => {
                            return (
                                <Col span={6}>
                                    <Card
                                        width='100px'
                                        hoverable
                                        onClick={() => {
                                            props.setApplication((ikey.url).replace('/selectors', ''))
                                            props.setApplicationModalVisible(false)
                                            props.setApplicationName(ikey.application)
                                        }}>
                                        <div className={style.SelectedApplication}>
                                            <div>
                                                {ikey.application}
                                            </div>
                                            <div>
                                                {'/selectors' + props.application === ikey.url ? <CheckOutlined /> : null}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </div>
        </Modal>
    )
}

export default Applications