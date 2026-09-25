class Solution {
    unordered_map<int, int> memo;
public:
    int fib(int n) {
        if (n < 2) return n;
        auto it = memo.find(n);
        if (it != memo.end()) return it->second;       // already computed
        return memo[n] = fib(n - 1) + fib(n - 2);
    }
};
