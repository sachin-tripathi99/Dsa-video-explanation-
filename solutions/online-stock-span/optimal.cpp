class StockSpanner {
    vector<pair<int, int>> st;                            // (price, span), prices decreasing
public:
    StockSpanner() {}

    int next(int price) {
        int span = 1;
        while (!st.empty() && st.back().first <= price) { span += st.back().second; st.pop_back(); }   // absorb its span
        st.push_back({price, span});
        return span;
    }
};
