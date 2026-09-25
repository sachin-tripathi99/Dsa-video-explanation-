class Solution {
    static void removeAll(string& s, const string& pat) {
        size_t p;
        while ((p = s.find(pat)) != string::npos) s.erase(p, 2);
    }
public:
    bool isValid(string s) {
        string prev;
        do {
            prev = s;
            removeAll(s, "()"); removeAll(s, "[]"); removeAll(s, "{}");   // delete matched pairs
        } while (s != prev);
        return s.empty();
    }
};
