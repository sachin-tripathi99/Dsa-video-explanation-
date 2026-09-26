class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        for (long long k = 1; ; k++) {
            long long hours = 0;
            for (int p : piles) hours += (p + k - 1) / k;
            if (hours <= h) return k;
        }
    }
};
