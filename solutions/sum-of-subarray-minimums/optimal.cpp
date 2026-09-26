class Solution {
public:
    int sumSubarrayMins(vector<int>& arr) {
        int n = arr.size();
        const long long MOD = 1'000'000'007;
        vector<int> left(n), right(n), st;
        for (int i = 0; i < n; i++) {                       // previous strictly smaller
            while (!st.empty() && arr[st.back()] > arr[i]) st.pop_back();
            left[i] = st.empty() ? i + 1 : i - st.back();
            st.push_back(i);
        }
        st.clear();
        for (int i = n - 1; i >= 0; i--) {                  // next smaller or equal
            while (!st.empty() && arr[st.back()] >= arr[i]) st.pop_back();
            right[i] = st.empty() ? n - i : st.back() - i;
            st.push_back(i);
        }
        long long total = 0;
        for (int i = 0; i < n; i++) total = (total + (long long)arr[i] * left[i] % MOD * right[i]) % MOD;
        return (int)total;
    }
};
