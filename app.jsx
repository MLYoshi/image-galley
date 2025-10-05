import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    // 状态：图片路径列表
    const [imagePaths, setImagePaths] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const pageSize = 3;
    const totalPages = Math.ceil(imagePaths.length / pageSize);

    // Step 1: 调用 JSON 找到图片（useEffect 加载）
    useEffect(() => {
        fetch('/images-list.json')
            .then(response => {
                if (!response.ok) throw new Error('JSON 加载失败');
                return response.json();
            })
            .then(data => {
                // 从 JSON 提取 path 数组
                const paths = data.map(item => item.path);
                setImagePaths(paths);
                setLoading(false);
            })
            .catch(error => {
                console.error('加载 JSON 出错:', error);
                setLoading(false);
                // 回退到空数组或默认图片
            });
    }, []);

    // Step 2: 计算当前页图片
    const getCurrentImages = () => {
        const startIndex = currentPage * pageSize;
        return imagePaths.slice(startIndex, startIndex + pageSize);
    };

    // Step 3: 翻页函数
    const goToPage = (page) => {
        setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
    };

    if (loading) {
        return <div className="App">加载图片列表中...</div>;
    }

    return (
        <div className="App">
            <div className="last-page"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
            >

            </div>
            <div className="gallery">

                {getCurrentImages().map((src, index) => (
                    <card>
                        <img
                            key={currentPage * pageSize + index}
                            src={src}  // 从 JSON path 直接用
                            alt={`图片 ${currentPage * pageSize + index + 1}`}
                            className="gallery-img"
                        />
                    </card>
                ))}





            </div>

            <div className="next-page"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >

            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);