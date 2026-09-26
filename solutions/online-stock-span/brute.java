class StockSpanner {
    private final List<Integer> prices = new ArrayList<>();

    public StockSpanner() {}

    public int next(int price) {
        prices.add(price);
        int span = 0;
        for (int i = prices.size() - 1; i >= 0 && prices.get(i) <= price; i--) span++;
        return span;
    }
}
