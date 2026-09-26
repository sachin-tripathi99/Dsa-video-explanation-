class Solution {
public:
    string minRemoveToMakeValid(string s) {
        vector<bool> del(s.size(), false);
        vector<int> open;                                   // indices of unmatched "("
        for (int i = 0; i < (int)s.size(); i++) {
            if (s[i] == '(') open.push_back(i);
            else if (s[i] == ')') {
                if (!open.empty()) open.pop_back();
                else del[i] = true;                         // no partner
            }
        }
        for (int i : open) del[i] = true;                   // never closed
        string out;
        for (int i = 0; i < (int)s.size(); i++) if (!del[i]) out += s[i];
        return out;
    }
};
