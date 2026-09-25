class MinStack {
    vector<pair<int, int>> st;                   // {value, min so far}
public:
    MinStack() {}
    void push(int val) {
        int m = st.empty() ? val : min(val, st.back().second);
        st.push_back({val, m});
    }
    void pop() { st.pop_back(); }
    int top() { return st.back().first; }
    int getMin() { return st.back().second; }
};
