class Solution {
public:
    int countArrangement(int n) {
        vector<int> p(n);
        iota(p.begin(), p.end(), 1);
        int count = 0;
        do {                                                // every permutation
            bool ok = true;
            for (int i = 0; i < n && ok; i++) ok = p[i] % (i + 1) == 0 || (i + 1) % p[i] == 0;
            count += ok;
        } while (next_permutation(p.begin(), p.end()));
        return count;
    }
};
