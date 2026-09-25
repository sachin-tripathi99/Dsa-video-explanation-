class Solution {
public:
    int minStoneSum(vector<int>& piles, int k) {
        for (int op = 0; op < k; op++) {
            int m = max_element(piles.begin(), piles.end()) - piles.begin();   // scan for the largest
            piles[m] -= piles[m] / 2;
        }
        return accumulate(piles.begin(), piles.end(), 0);
    }
};
