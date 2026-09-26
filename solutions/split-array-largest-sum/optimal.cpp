class Solution {
    int parts(vector<int>& a, long long cap) {                  // greedy: new part when the next number overflows
        int p = 1;
        long long s = 0;
        for (int x : a) {
            if (s + x > cap) { p++; s = 0; }
            s += x;
        }
        return p;
    }
public:
    int splitArray(vector<int>& nums, int k) {
        long long lo = *max_element(nums.begin(), nums.end());
        long long hi = accumulate(nums.begin(), nums.end(), 0LL);   // [largest element, total]
        while (lo < hi) {
            long long mid = lo + (hi - lo) / 2;
            if (parts(nums, mid) <= k) hi = mid;                // cap achievable
            else lo = mid + 1;
        }
        return (int)lo;
    }
};
