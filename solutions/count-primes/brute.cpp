class Solution {
public:
    int countPrimes(int n) {
        int count = 0;
        for (int x = 2; x < n; x++) {
            bool prime = true;
            for (long long d = 2; d * d <= x; d++) {
                if (x % d == 0) { prime = false; break; }
            }
            if (prime) count++;
        }
        return count;
    }
};
