---
title: Todo App에서 React-Query 사용한 것과 그렇지 않은 코드 비교
description:
categories: [기타]
tags: [React, React-Query]
publishedDate: 2022/08/08
lastModifiedAt: 2022/08/08
---

# Todo List를 만드는데 React-Query를 사용한 것과 사용하지 않은 코드 비교

간단한 todo list를 만들어보고 소감을 남깁니다.

**결론**

React-Query를 사용한 경우 따로 state를 사용하지 않아도 됐다.

또 Todo를 생성, 제거 한 경우 **Todo목록 업데이트**를 한다면 React-Query를 사용하지 않은 경우 `setState`로 저장된 값을 수정하고 React-Query를 사용한 경우 `onSettled`, `setQueryData` 두 함수로 캐시를 수정한다. 이하 코드에서는 React-Query를 사용하지 않은 게 더 깔끔한 거 같다.

이하 코드는 한 페이지에서 모든 기능이 동작하는데 만약 **캐시의 수정이 다른 페이지에서 이뤄진다면** React-Query가 `Query Key`로 어디서든 값을 불러올 수 있기 때문에 편할 것 같다.

React-Query는 **오픈소스고 구조화가 돼** 있기 때문에 여럿이 **협업을 한다면** 팀의 규칙을 만드는 것보다 React-Query를 배우는 게 팀을 벗어나도 어딘가에 쓸 확률이 높아서 좋을 거 같다.

**요약**

- 간단한 코드에서는 크게 필요성을 못 느꼈다.
- 여러 페이지에서 값을 사용한다면 매우 편할 것이다.
- 협업을 한다면 어디에서 어떤 작업을 할지 구조화 돼 있는 오픈소스를 쓰는 게 나중에도 여기저기 쓰기 좋다.

---

## React-Query 사용하지 않은 코드

```tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function TodoList() {
  const [todosData, setTodosData] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo | null>(null);

  // ✅ getTodos
  useEffect(() => {
    (async () => {
      const todos = await getTodos();
      setTodosData(todos.todos || []);
    })();
  }, []);

  // ✅ getTodo
  const getTodo = async (todoId: string) => {
    const data = await getTodoById({ id: todoId });
    if (!data.todo) {
      alert('todo를 찾을 수 없습니다');
      return;
    }
    setTodo(data.todo);
  };

  const param = useParams();

  useEffect(() => {
    // 화면에 표시 중인 todo를 지우기 위한 동작
    if (!param.todoId) {
      todo && setTodo(null);
      return;
    }
    getTodo(param.todoId);
  }, [param]);

  // ✅ createTodo
  const createSubmit = async (
    event: FormEvent,
    { title, content }: CreateTodoInputDto
  ) => {
    event.preventDefault();
    if (!title || !content) throw new Error('데이터를 입력해주세요');

    const createdTodo = await createTodo({ content, title });
    if (createdTodo.todo) {
      setTodoData((prevState) => [...prevState, createdTodo.todo!]);
    }
  };

  // ✅ deleteTodo
  const deleteTodo = async (todoId: string) => {
    const del = await deleteTodoById({ id: todoId });
    if (!del.ok) alert('todo 삭제에 실패했습니다');
    if (todoId === todo?.id) setTodo(null);
    if (todoId === todoToBeModified?.id) setTodoToBeModified(null);
    if (hasUpdateInput) setHasUpdateInput(false);

    setTodoData((prevState) => {
      const idx = prevState.findIndex((todo) => todo.id === todoId);
      if (idx === -1)
        throw new Error('Todo 삭제 후 업데이트 중 기존 자료를 찾지 못했습니다');
      return removeItemInArrayByIndex(idx, prevState);
    });
  };

  return (
    <div>
      {todosData.map((todo) => (
        <div>{todo.title}</div>
      ))}
    </div>
  );
}
```

## React-Query 사용한 코드

```tsx
import { useParams } from 'react-router-dom';
const queryClient = new QueryClient();

export default function TodoList() {
	// ✅ getTodos
	const { data: todosData } = useQuery<TodosOutputDto>(['todos'], getTodos);

	// ✅ getTodo
	const param = useParams();
	const { data: todoData } = useQuery<GetTodoByIdOutputDto>(
		['todo', param.todoId],
		() => getTodoById({ id: param.todoId!	);
	)

	// ✅ createTodo
	const createMutation = useMutation<
		CreateTodoOutputDto,
		unknown,
		CreateTodoInputDto
	>(createTodo, {
		onSettled: (data) => {
			// setQueryData는 키값에 해당하는 캐시 데이터를 불러온다
			// 두 번째 인자는 업데이트 함수다
			queryClient.setQueryData(['todos'], (prevData?: TodosOutputDto) => {
				if (!prevData?.todos || !data?.todo) return;
				return { ...prevData, todos: [...prevData.todos, data.todo] };
			});
		},
	});

	const createSubmit = (
		event: FormEvent,
		createTodoInput: CreateTodoInputDto
	) => {
		event.preventDefault();
		if (!title || !content) throw new Error('데이터를 입력해주세요');
		createMutation.mutate(createTodoInput);
	};

	// ✅ deleteTodo
	const deleteTodo = (todoId: string) => {
		deleteMutation.mutate(
			{ id: todoId },
			{
			onSettled: (data, _, variables) => {
				if (!data?.ok) {
					alert('todo 삭제에 실패했습니다');
					return;
				}
				if (param.todoId === todoId) {
					navigation('/');
				}

				if (variables.id === todoToBeModified?.id) setTodoToBeModified(null);
				if (hasUpdateInput) setHasUpdateInput(false);

				queryClient.setQueryData(['todo', variables.id], null);
				queryClient.setQueryData(['todos'], (prevData?: TodosOutputDto) => {
					if (!prevData?.todos) return;
					const idx = prevData.todos?.findIndex((todo) => todo.id === todoId) || null;
					if (idx === -1 || idx === null){
						throw Error('삭제할 Todo의 index를 찾을 수 없습니다');
					}

					return { todos: removeItemInArrayByIndex(idx, prevData.todos) };
					});
				},
			}
		);
	};

	return <div>{todosData.map((todo) => <div>{todo.title}</div>)}</div>
```

## React-Query method

### useMutation의 side effect

```jsx
const mutation = useMutation(fetchFx, {
  onMutate: (variables) => {
    // A mutation is about to happen!
    // Optionally return a context containing data to use when for example rolling back
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    // An error happened!
  },
  onSuccess: (data, variables, context) => {
    // mutation 이 성공하고 결과를 전달할 때 실행
    console.log('onSuccess가 먼저 실행되고');
  },
  onSettled: (data, error, variables, context) => {
    // mutation의 성공이나 실패 상관없이 성공한 데이터 또는 error가 전달될 때 실행
    console.log('onSettled가 나중에 실행된다');
  },
});
```

#### 연속 돌연변이(Consecutive mutations)

```jsx
useMutation(addTodo, {
  onSuccess: (data, error, variables, context) => {
    // 3번 실행된다
  },
})[('Todo 1', 'Todo 2', 'Todo 3')].forEach((todo) => {
  mutate(todo, {
    onSuccess: (data, error, variables, context) => {
      // mutation이 완료되는 순서와 상관없이 마지막 mutation(Todo 3)에서 한 번만 실행된다
    },
  });
});
```
