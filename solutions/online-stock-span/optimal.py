class StockSpanner:
    def __init__(self):
        self.st = []                            # (price, span), prices decreasing

    def next(self, price: int) -> int:
        span = 1
        while self.st and self.st[-1][0] <= price:
            span += self.st.pop()[1]            # absorb its span
        self.st.append((price, span))
        return span
