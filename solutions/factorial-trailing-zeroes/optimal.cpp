class Solution {
public:
    int trailingZeroes(int n) {
        int count = 0;
        while (n > 0) {
            n /= 5;            // how many numbers have one more factor of 5
            count += n;
        }
        return count;
    }
};
