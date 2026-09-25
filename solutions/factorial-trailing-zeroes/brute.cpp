class Solution {
public:
    int trailingZeroes(int n) {
        int count = 0;
        for (int i = 5; i <= n; i += 5) {    // only multiples of 5 contribute
            int x = i;
            while (x % 5 == 0) { count++; x /= 5; }
        }
        return count;
    }
};
