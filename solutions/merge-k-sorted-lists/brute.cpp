class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        vector<int> vals;
        for (ListNode* l : lists) for (ListNode* p = l; p; p = p->next) vals.push_back(p->val);
        sort(vals.begin(), vals.end());
        ListNode dummy(0), *tail = &dummy;
        for (int x : vals) { tail->next = new ListNode(x); tail = tail->next; }
        return dummy.next;
    }
};
