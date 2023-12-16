template <typename T> 
class Node
{
	public:
	T value;
	Node<T>* next;
	Node(T newVal)
	{
		value = newVal;
		next = nullptr;
	}
	Node()
	{
		value = 0;
		next = nullptr;
	}
};

template <typename T> 
class Queue 
{
	Node <T>* head = nullptr;
	Node <T>* tail = nullptr;
	int size = 0;
	public: 
	
	
	
	void push(T x)
	{
		
		if (head == nullptr)
		{
			tail = new Node<T>(x);
			head = tail;
		}
		else
		{
			tail->next = new Node<T>(x);
			tail = tail->next;
		}
		++size;
	}
	
	
	void pop()
	{
		if (head == nullptr)
			return;
		Node<T>* tmp = head;
		head = head->next;
		delete tmp;
		--size;
	}
	
	
	bool isEmpty()
	{
		return size == 0 ;
	}
	
	void empty()
	{
		while (size > 0)
			this->pop();
	
	}
	
	int length()
	{
		return size;
	}
	
	T front()
	{
		return head->value;
	}
};

