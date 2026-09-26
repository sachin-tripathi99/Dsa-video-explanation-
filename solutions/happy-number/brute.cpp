class Solution {
    int step(int x) {
        int s = 0;
        while (x > 0) { int d = x % 10; s += d * d; x /= 10; }
        return s;
    }
public:
    bool isHappy(int n) {
        unordered_set<int> seen;
        while (n != 1 && seen.insert(n).second) n = step(n);
        return n == 1;
    }
};
