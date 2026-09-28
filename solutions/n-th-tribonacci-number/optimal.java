class Solution {
    public int tribonacci(int n) {
        if (n == 0) return 0;
        int a = 0, b = 1, c = 1;                            // T(i−3), T(i−2), T(i−1)
        for (int i = 3; i <= n; i++) {
            int d = a + b + c;
            a = b; b = c; c = d;
        }
        return c;
    }
}
