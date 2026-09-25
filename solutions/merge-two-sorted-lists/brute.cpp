class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        vector<int> vals;
        for (ListNode* c = list1; c; c = c->next) vals.push_back(c->val);
        for (ListNode* c = list2; c; c = c->next) vals.push_back(c->val);
        sort(vals.begin(), vals.end());
        ListNode dummy;
        ListNode* tail = &dummy;
        for (int x : vals) { tail->next = new ListNode(x); tail = tail->next; }
        return dummy.next;
    }
};
