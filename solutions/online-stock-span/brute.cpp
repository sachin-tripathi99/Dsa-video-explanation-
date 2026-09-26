class StockSpanner {
    vector<int> prices;
public:
    StockSpanner() {}

    int next(int price) {
        prices.push_back(price);
        int span = 0;
        for (int i = (int)prices.size() - 1; i >= 0 && prices[i] <= price; i--) span++;
        return span;
    }
};
