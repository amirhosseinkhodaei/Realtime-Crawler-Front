import { DownOutlined } from '@ant-design/icons'
import { Table, Skeleton } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import style from './ProductDetails.module.css'

const ProductDetails = (props) => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)



    const getData = () => {
        setLoading(true)
        axios.get('http://127.0.0.1:9080/crawl.json', {
            params: {
                spider_name: 'productdetail',
                start_requests: true,
                url: `https://polymer-additives.specialchem.com/${props.url}`
            }
        }).then((response) => {
            setData(response.data.items[0])
            setLoading(false)
        })
    }

    useEffect(() => {
        getData()
    }, [props.url]) // eslint-disable-line

    const column = [
        {
            title: 'Attributes',
            dataIndex: 'attributes',
            key: 'attributes',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        }
    ]

    // const column = Object.entries(data?.attributes || []).map(val => {
    //     return (
    //         {
    //             title: val[0],
    //             dataIndex: val[0],
    //             key: val[0],
    //         }
    //     );
    // })

    const dataSource = Object.entries(data?.attributes || {}).map(val => {
        return {
            attributes: val[0],
            value: val[1]
        };
    })

    console.log(dataSource)

    return (
        <div className={style.DetailModal}
            style={{ top: props.isModalVisible ? "0" : "100%" }}>
            <div className={style.DetailHeader}>
                <div style={{ marginLeft: '20px' }}>Product Detail</div>
                <div className={style.IconParent}
                    onClick={() => {
                        props.setModalVisible(false)
                    }}>
                    <DownOutlined />
                </div>
            </div>

            <div className={style.DetailContainer}>

                <div style={{ marginTop: '20px' }}>
                    <Skeleton paragraph={{ rows: 0 }} loading={loading}>
                        <h3>
                            {data?.products[0]?.productName}
                        </h3>
                    </Skeleton>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <Skeleton loading={loading}>
                        <p>{data?.products[0]?.description}</p>
                    </Skeleton>
                </div>
                <Skeleton loading={loading}>
                    <div>
                        <Table columns={column} dataSource={dataSource} />
                    </div>
                </Skeleton>

            </div>
        </div>
    )
}

export default ProductDetails