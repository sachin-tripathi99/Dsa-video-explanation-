class Solution {
public:
    bool wordPattern(string pattern, string s) {
        vector<string> w;
        stringstream ss(s);
        string x;
        while (ss >> x) w.push_back(x);
        int n = pattern.size();
        if ((int)w.size() != n) return false;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if ((pattern[i] == pattern[j]) != (w[i] == w[j])) return false;
        return true;
    }
};
