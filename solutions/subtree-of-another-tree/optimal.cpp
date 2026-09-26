class Solution {
    void ser(TreeNode* n, string& s) {                      // preorder with null markers
        if (!n) { s += ",#"; return; }
        s += "," + to_string(n->val);
        ser(n->left, s);
        ser(n->right, s);
    }
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        string text, pat;
        ser(root, text);
        ser(subRoot, pat);
        vector<int> fail(pat.size(), 0);                    // KMP failure function
        for (size_t i = 1, k = 0; i < pat.size(); i++) {
            while (k && pat[i] != pat[k]) k = fail[k - 1];
            if (pat[i] == pat[k]) k++;
            fail[i] = k;
        }
        for (size_t i = 0, k = 0; i < text.size(); i++) {
            while (k && text[i] != pat[k]) k = fail[k - 1];
            if (text[i] == pat[k]) k++;
            if (k == pat.size()) return true;
        }
        return false;
    }
};
