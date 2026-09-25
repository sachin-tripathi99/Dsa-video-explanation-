class MyStack {
    queue<int> q;
public:
    MyStack() {}
    void push(int x) {
        q.push(x);
        for (size_t k = 0; k + 1 < q.size(); k++) { q.push(q.front()); q.pop(); }   // rotate: newest to the front
    }
    int pop() { int x = q.front(); q.pop(); return x; }
    int top() { return q.front(); }
    bool empty() { return q.empty(); }
};
