'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Todo = {
  id: string
  title: string
  is_completed: boolean
  created_at: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  // Read: 앱 시작 시 todos 불러오기
  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching todos:', error)
    } else {
      setTodos(data ?? [])
    }
    setLoading(false)
  }

  // Create: 새 할 일 추가
  async function addTodo() {
    const title = inputValue.trim()
    if (!title) return

    const { data, error } = await supabase
      .from('todos')
      .insert({ title })
      .select()
      .single()

    if (error) {
      console.error('Error adding todo:', error)
    } else {
      setTodos([data, ...todos])
      setInputValue('')
    }
  }

  // Update: 완료 상태 토글
  async function toggleTodo(id: string, is_completed: boolean) {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !is_completed })
      .eq('id', id)

    if (error) {
      console.error('Error updating todo:', error)
    } else {
      setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !is_completed } : t))
    }
  }

  // Delete: 할 일 삭제
  async function deleteTodo(id: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting todo:', error)
    } else {
      setTodos(todos.filter(t => t.id !== id))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addTodo()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">나의 할 일</h1>

        {/* 입력창 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="새로운 할 일을 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            추가
          </button>
        </div>

        {/* 할 일 목록 */}
        {loading ? (
          <p className="text-center text-gray-400">로딩 중...</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-gray-400">할 일이 없습니다. 추가해보세요!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map(todo => (
              <li
                key={todo.id}
                className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100"
              >
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => toggleTodo(todo.id, todo.is_completed)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <span className={`flex-1 text-gray-700 ${todo.is_completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 hover:text-red-600 transition-colors text-sm"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
