class Solution {
public:
    int sumSubarrayMins(vector<int>& arr) {
        const long long MOD = 1'000'000'007;
        long long total = 0;
        for (size_t i = 0; i < arr.size(); i++) {
            int m = INT_MAX;
            for (size_t j = i; j < arr.size(); j++) {
                m = min(m, arr[j]);
                total = (total + m) % MOD;
            }
        }
        return (int)total;
    }
};
